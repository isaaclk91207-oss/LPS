import io
from datetime import datetime, timezone

import qrcode
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, get_db, Base
from models import User, LoyaltyPoint, Reward
from schemas import (
    UserCreate, UserLogin, TokenResponse,
    CustomerInfo, RewardProgress, RewardHistoryItem, CustomerDashboard,
    AddPointRequest, RedeemRewardRequest, CustomerLookup,
)
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_role,
    create_qr_token, verify_qr_token,
)
from seed import seed_database

# Create tables
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(title="uab Cafe Loyalty API", security=[{"HTTPBearer": []}])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.40.76:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Helper
# ──────────────────────────────────────────────

COFFEE_REWARD_THRESHOLD = 10
TUMBLER_REWARD_THRESHOLD = 80
COFFEE_REWARD_VALUE = 6000


def get_total_points(db: Session, customer_id: int) -> int:
    result = db.query(func.coalesce(func.sum(LoyaltyPoint.points), 0)).filter(
        LoyaltyPoint.customer_id == customer_id
    ).scalar()
    return result


def get_redeemed_points(db: Session, customer_id: int) -> int:
    result = db.query(func.coalesce(func.sum(Reward.points_spent), 0)).filter(
        Reward.customer_id == customer_id
    ).scalar()
    return result


def calc_progress(db: Session, customer_id: int) -> RewardProgress:
    total = get_total_points(db, customer_id)
    redeemed = get_redeemed_points(db, customer_id)
    available = total - redeemed

    coffee_progress = available % COFFEE_REWARD_THRESHOLD
    coffee_reward_available = available >= COFFEE_REWARD_THRESHOLD

    # Tumbler uses cumulative points (not affected by coffee redemptions)
    tumbler_progress = total % TUMBLER_REWARD_THRESHOLD
    tumbler_reward_available = total >= TUMBLER_REWARD_THRESHOLD

    return RewardProgress(
        current_points=available,
        coffee_progress=coffee_progress if not coffee_reward_available else COFFEE_REWARD_THRESHOLD,
        coffee_reward_available=coffee_reward_available,
        tumbler_progress=tumbler_progress if not tumbler_reward_available else TUMBLER_REWARD_THRESHOLD,
        tumbler_reward_available=tumbler_reward_available,
    )


def next_customer_code(db: Session) -> str:
    last = db.query(User).filter(User.role == "customer").order_by(User.id.desc()).first()
    if last and last.customer_code:
        num = int(last.customer_code.split("-")[1]) + 1
    else:
        num = 1
    return f"CUS-{num:03d}"


# ──────────────────────────────────────────────
# Auth Routes
# ──────────────────────────────────────────────

@app.post("/api/auth/register", response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        name=data.name,
        username=data.username,
        password_hash=hash_password(data.password),
        role="customer",
        customer_code=next_customer_code(db),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, role=user.role, name=user.name)


@app.post("/api/auth/login", response_model=TokenResponse)
def login_customer(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username, User.role == "customer").first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, role=user.role, name=user.name)


@app.post("/api/auth/barista/login", response_model=TokenResponse)
def login_barista(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username, User.role == "barista").first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, role=user.role, name=user.name)


# ──────────────────────────────────────────────
# Customer Routes
# ──────────────────────────────────────────────

@app.get("/api/customer/me", response_model=CustomerInfo)
def get_me(current_user: User = Depends(require_role("customer"))):
    return current_user


@app.get("/api/customer/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    progress = calc_progress(db, current_user.id)
    history = (
        db.query(Reward)
        .filter(Reward.customer_id == current_user.id)
        .order_by(Reward.redeemed_at.desc())
        .all()
    )
    return {
        "customer": CustomerInfo.model_validate(current_user),
        "progress": progress,
        "history": [
            RewardHistoryItem(
                id=r.id,
                reward_type=r.reward_type,
                points_spent=r.points_spent,
                redeemed_at=r.redeemed_at,
            )
            for r in history
        ],
    }


@app.get("/api/customer/qr")
def get_qr_code(current_user: User = Depends(require_role("customer"))):
    qr = qrcode.make(current_user.customer_code)
    buf = io.BytesIO()
    qr.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")


@app.get("/api/customer/qr-dynamic")
def get_dynamic_qr_token(current_user: User = Depends(require_role("customer"))):
    token = create_qr_token(current_user.id)
    return {"token": token, "expires_in": 30}


@app.get("/api/customer/points")
def get_point_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("customer")),
):
    points = (
        db.query(LoyaltyPoint)
        .filter(LoyaltyPoint.customer_id == current_user.id)
        .order_by(LoyaltyPoint.created_at.desc())
        .all()
    )
    result = []
    for p in points:
        barista = db.query(User).filter(User.id == p.barista_id).first()
        result.append({
            "id": p.id,
            "points": p.points,
            "created_at": p.created_at,
            "barista_name": barista.name if barista else "Unknown",
        })
    return result


# ──────────────────────────────────────────────
# Barista Routes
# ──────────────────────────────────────────────

@app.get("/api/barista/customer/{code}", response_model=CustomerLookup)
def lookup_customer(
    code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    user = db.query(User).filter(User.customer_code == code, User.role == "customer").first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = get_total_points(db, user.id)
    redeemed = get_redeemed_points(db, user.id)
    available = total - redeemed
    coffee_progress = available % COFFEE_REWARD_THRESHOLD
    coffee_reward_available = available >= COFFEE_REWARD_THRESHOLD
    tumbler_progress = total % TUMBLER_REWARD_THRESHOLD
    tumbler_reward_available = total >= TUMBLER_REWARD_THRESHOLD

    return CustomerLookup(
        id=user.id,
        name=user.name,
        customer_code=user.customer_code,
        total_points=available,
        coffee_progress=coffee_progress if not coffee_reward_available else COFFEE_REWARD_THRESHOLD,
        coffee_reward_available=coffee_reward_available,
        coffee_max_value=COFFEE_REWARD_VALUE,
        tumbler_progress=tumbler_progress if not tumbler_reward_available else TUMBLER_REWARD_THRESHOLD,
        tumbler_reward_available=tumbler_reward_available,
    )


@app.get("/api/barista/search")
def search_customers(
    q: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    query = db.query(User).filter(User.role == "customer")
    if q.strip():
        search = f"%{q.strip()}%"
        query = query.filter(
            (User.name.ilike(search)) | (User.customer_code.ilike(search))
        )
    users = query.order_by(User.id.desc()).limit(20).all()
    result = []
    for u in users:
        total = get_total_points(db, u.id)
        redeemed = get_redeemed_points(db, u.id)
        available = total - redeemed
        result.append({
            "id": u.id,
            "name": u.name,
            "customer_code": u.customer_code,
            "total_points": available,
        })
    return result


@app.post("/api/barista/scan")
def scan_qr_token(
    data: AddPointRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    """Verify a dynamic QR token and return customer info."""
    try:
        customer_id = verify_qr_token(data.customer_code)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user = db.query(User).filter(User.id == customer_id, User.role == "customer").first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = get_total_points(db, user.id)
    redeemed = get_redeemed_points(db, user.id)
    available = total - redeemed
    coffee_progress = available % COFFEE_REWARD_THRESHOLD
    coffee_reward_available = available >= COFFEE_REWARD_THRESHOLD
    tumbler_progress = total % TUMBLER_REWARD_THRESHOLD
    tumbler_reward_available = total >= TUMBLER_REWARD_THRESHOLD

    return {
        "id": user.id,
        "name": user.name,
        "customer_code": user.customer_code,
        "total_points": available,
        "coffee_progress": coffee_progress if not coffee_reward_available else COFFEE_REWARD_THRESHOLD,
        "coffee_reward_available": coffee_reward_available,
        "coffee_max_value": COFFEE_REWARD_VALUE,
        "tumbler_progress": tumbler_progress if not tumbler_reward_available else TUMBLER_REWARD_THRESHOLD,
        "tumbler_reward_available": tumbler_reward_available,
    }


@app.get("/api/barista/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    total_customers = db.query(User).filter(User.role == "customer").count()
    total_points = db.query(func.coalesce(func.sum(LoyaltyPoint.points), 0)).scalar()
    total_rewards = db.query(Reward).count()
    coffee_rewards = db.query(Reward).filter(Reward.reward_type == "coffee").count()
    tumbler_rewards = db.query(Reward).filter(Reward.reward_type == "tumbler").count()
    return {
        "total_customers": total_customers,
        "total_points": total_points,
        "total_rewards": total_rewards,
        "coffee_rewards": coffee_rewards,
        "tumbler_rewards": tumbler_rewards,
    }


@app.post("/api/barista/point")
def add_point(
    data: AddPointRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    customer = db.query(User).filter(
        User.customer_code == data.customer_code, User.role == "customer"
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    point = LoyaltyPoint(
        customer_id=customer.id,
        points=1,
        barista_id=current_user.id,
    )
    db.add(point)
    db.commit()

    progress = calc_progress(db, customer.id)
    return {"message": "Point added", "progress": progress}


@app.post("/api/barista/redeem")
def redeem_reward(
    data: RedeemRewardRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    progress = calc_progress(db, data.customer_id)

    if data.reward_type == "coffee":
        if not progress.coffee_reward_available:
            raise HTTPException(status_code=400, detail="Coffee reward not available")
        points_spent = COFFEE_REWARD_THRESHOLD
    elif data.reward_type == "tumbler":
        if not progress.tumbler_reward_available:
            raise HTTPException(status_code=400, detail="Tumbler reward not available")
        points_spent = TUMBLER_REWARD_THRESHOLD
    else:
        raise HTTPException(status_code=400, detail="Invalid reward type")

    reward = Reward(
        customer_id=data.customer_id,
        reward_type=data.reward_type,
        points_spent=points_spent,
        barista_id=current_user.id,
    )
    db.add(reward)
    db.commit()

    updated_progress = calc_progress(db, data.customer_id)
    return {"message": f"{data.reward_type.capitalize()} reward redeemed", "progress": updated_progress}


@app.get("/api/barista/history")
def get_all_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("barista")),
):
    rewards = db.query(Reward).order_by(Reward.redeemed_at.desc()).all()
    result = []
    for r in rewards:
        customer = db.query(User).filter(User.id == r.customer_id).first()
        barista = db.query(User).filter(User.id == r.barista_id).first()
        result.append({
            "id": r.id,
            "customer_name": customer.name if customer else "Unknown",
            "customer_code": customer.customer_code if customer else "",
            "reward_type": r.reward_type,
            "points_spent": r.points_spent,
            "redeemed_at": r.redeemed_at,
            "barista_name": barista.name if barista else "Unknown",
        })
    return result

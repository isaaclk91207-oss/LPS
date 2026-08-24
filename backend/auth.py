from datetime import datetime, timedelta, timezone
from typing import Optional
import hmac
import hashlib
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import User

SECRET_KEY = "uab-cafe-loyalty-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
QR_TOKEN_EXPIRY_SECONDS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def require_role(role: str):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {role}",
            )
        return current_user
    return role_checker


# ──────────────────────────────────────────────
# Dynamic QR Token
# ──────────────────────────────────────────────

def _hmac_sign(message: str) -> str:
    return hmac.new(
        SECRET_KEY.encode(), message.encode(), hashlib.sha256
    ).hexdigest()[:16]


def create_qr_token(customer_id: int) -> str:
    timestamp = int(time.time())
    payload = f"{customer_id}.{timestamp}"
    signature = _hmac_sign(payload)
    return f"UAB{payload}.{signature}"


def verify_qr_token(token: str) -> int:
    """Verify QR token and return customer_id. Raises ValueError if invalid/expired."""
    if not token.startswith("UAB"):
        raise ValueError("Invalid QR token format")

    parts = token[3:].split(".")
    if len(parts) != 3:
        raise ValueError("Invalid QR token structure")

    customer_id_str, timestamp_str, signature = parts

    try:
        customer_id = int(customer_id_str)
        timestamp = int(timestamp_str)
    except ValueError:
        raise ValueError("Invalid QR token data")

    # Verify signature
    expected_sig = _hmac_sign(f"{customer_id}.{timestamp}")
    if not hmac.compare_digest(signature, expected_sig):
        raise ValueError("Invalid QR token signature")

    # Check expiry
    age = int(time.time()) - timestamp
    if age > QR_TOKEN_EXPIRY_SECONDS:
        raise ValueError("QR code expired")

    return customer_id

from database import engine, SessionLocal, Base
from models import User, LoyaltyPoint
from auth import hash_password


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Create default barista account
        barista = db.query(User).filter(User.username == "barista").first()
        if not barista:
            barista = User(
                username="barista",
                name="Barista Staff",
                password_hash=hash_password("barista123"),
                role="barista",
            )
            db.add(barista)
            db.commit()
            db.refresh(barista)
            print("Default barista account created: barista / barista123")

        # Create demo customers
        demo_customers = [
            ("aungaung", "Aung Aung", "pass123", 5),
            ("kyikyi", "Kyi Kyi", "pass123", 25),
            ("minaung", "Min Aung", "pass123", 75),
        ]

        for username, name, password, pts in demo_customers:
            existing = db.query(User).filter(User.username == username).first()
            if not existing:
                customer = User(
                    username=username,
                    name=name,
                    password_hash=hash_password(password),
                    role="customer",
                    customer_code=f"CUS-{(db.query(User).filter(User.role == 'customer').count() + 1):03d}",
                )
                db.add(customer)
                db.commit()
                db.refresh(customer)

                # Add loyalty points
                for _ in range(pts):
                    point = LoyaltyPoint(
                        customer_id=customer.id,
                        points=1,
                        barista_id=barista.id,
                    )
                    db.add(point)
                db.commit()
                print(f"Demo customer created: {username} / {password} ({pts} points)")
            else:
                print(f"Customer '{username}' already exists.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

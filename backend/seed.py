import logging
from database import SessionLocal
from models import User, LoyaltyPoint
from auth import hash_password

logger = logging.getLogger("uvicorn")


def seed_database():
    db = SessionLocal()

    try:
        existing_barista = db.query(User).filter(User.username == "barista").first()
        if existing_barista:
            logger.info("Seed data already exists, skipping seed")
            return

        logger.info("Seeding database with default accounts...")

        barista = User(
            username="barista",
            name="Barista Staff",
            password_hash=hash_password("barista123"),
            role="barista",
        )
        db.add(barista)
        db.commit()
        db.refresh(barista)
        logger.info("Created barista: barista / barista123")

        demo_customers = [
            # ("aungaung", "Aung Aung", "pass123", 5),
            ("kyikyi", "Kyi Kyi", "pass123", 25),
            ("minaung", "Min Aung", "pass123", 75),
        ]

        for username, name, password, pts in demo_customers:
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

            for _ in range(pts):
                point = LoyaltyPoint(
                    customer_id=customer.id,
                    points=1,
                    barista_id=barista.id,
                )
                db.add(point)
            db.commit()
            logger.info(f"Created customer: {username} / {password} ({pts} points)")

        logger.info("Database seeding completed successfully")
    except Exception as e:
        logger.error(f"Seed failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

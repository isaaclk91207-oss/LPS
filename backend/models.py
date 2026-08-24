from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="customer")  # "customer" or "barista"
    customer_code = Column(String, unique=True, index=True, nullable=True)  # e.g. CUS-001
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class LoyaltyPoint(Base):
    __tablename__ = "loyalty_points"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    barista_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_type = Column(String, nullable=False)  # "coffee" or "tumbler"
    points_spent = Column(Integer, nullable=False)
    redeemed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    barista_id = Column(Integer, ForeignKey("users.id"), nullable=False)

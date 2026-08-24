from datetime import datetime
from pydantic import BaseModel


# ---------- Auth ----------

class UserCreate(BaseModel):
    name: str
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


# ---------- Customer ----------

class CustomerInfo(BaseModel):
    id: int
    name: str
    username: str
    customer_code: str

    class Config:
        from_attributes = True


class RewardProgress(BaseModel):
    current_points: int
    coffee_progress: int  # 0-10
    coffee_reward_available: bool
    coffee_max_value: int = 6000
    tumbler_progress: int  # 0-80
    tumbler_reward_available: bool


class RewardHistoryItem(BaseModel):
    id: int
    reward_type: str
    points_spent: int
    redeemed_at: datetime


class CustomerDashboard(BaseModel):
    customer: CustomerInfo
    progress: RewardProgress
    history: list[RewardHistoryItem]


# ---------- Barista ----------

class AddPointRequest(BaseModel):
    customer_code: str


class RedeemRewardRequest(BaseModel):
    customer_id: int
    reward_type: str  # "coffee" or "tumbler"


class CustomerLookup(BaseModel):
    id: int
    name: str
    customer_code: str
    total_points: int
    coffee_progress: int
    coffee_reward_available: bool
    coffee_max_value: int = 6000
    tumbler_progress: int
    tumbler_reward_available: bool

    class Config:
        from_attributes = True

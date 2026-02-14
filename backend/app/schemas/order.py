import uuid
from typing import Literal
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime

class OrderCreateOut(BaseModel):
    id: uuid.UUID
    status: str

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    variant_id: uuid.UUID | None = None
    product_id: uuid.UUID
    quantity: int = Field(ge=1)


class OrderItemOut(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    product_id: uuid.UUID
    variant_id: uuid.UUID | None
    quantity: int
    unit_price: Decimal

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    created_at: datetime | None
    paid_at: datetime | None
    shipped_at: datetime | None
    delivered_at: datetime | None

    class Config:
        from_attributes = True


class OrderDetailOut(BaseModel):
    order: OrderOut
    items: list[OrderItemOut]
    total: Decimal


class OrderStatusUpdate(BaseModel):
    status: Literal["shipped", "delivered"]

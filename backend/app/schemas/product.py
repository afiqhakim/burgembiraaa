from pydantic import BaseModel, Field
from decimal import Decimal
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)

class VariantCreate(BaseModel):
    colour: str = Field(min_length=1, max_length=50)
    size: str = Field(min_length=1, max_length=30)
    unit_price: Decimal = Field(gt=0)
    stock: int = Field(ge=0)

class ProductVariationOut(BaseModel):
    id: UUID
    product_id: UUID
    colour: str
    size: str
    sku: str | None = None
    unit_price: Decimal
    stock: int
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class ProductOut(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: str | None = None
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None
    variants: List[ProductVariationOut] = []
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    total_stock: int = 0

    class Config:
        from_attributes = True

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

class ProductToggleActive(BaseModel):
    is_active: bool

class PaginatedProducts(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    page_size: int

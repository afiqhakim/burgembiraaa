import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role_ids
from app.models.user import User
from app.models.product import Product
from app.models.product_variation import ProductVariation
from app.schemas.product import ProductCreate, VariantCreate, ProductUpdate, ProductToggleActive, ProductOut

router = APIRouter(prefix="/seller", tags=["seller"])

ADMIN_OR_SELLER = {1, 2}

def _ensure_owner_or_admin(user: User, product: Product):
    """Admin can edit anything, seller can only edit own products"""
    if user.role_id == 1:  # admin
        return
    if user.role_id == 2 and product.user_id == user.id:  # seller
        return
    raise HTTPException(status_code=403, detail="Not allowed")

@router.post("/products", response_model=ProductOut)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role_ids(ADMIN_OR_SELLER)),
):
    product = Product(
        user_id=user.id,
        name=payload.name,
        description=payload.description,
        is_active=True,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: uuid.UUID,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role_ids(ADMIN_OR_SELLER)),
):
    """Update product name and/or description"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    _ensure_owner_or_admin(user, product)

    if payload.name is not None:
        product.name = payload.name
    if payload.description is not None:
        product.description = payload.description

    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.patch("/products/{product_id}/active")
def toggle_product_active(
    product_id: uuid.UUID,
    payload: ProductToggleActive,
    db: Session = Depends(get_db),
    user: User = Depends(require_role_ids(ADMIN_OR_SELLER)),
):
    """Toggle product is_active status"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    _ensure_owner_or_admin(user, product)

    product.is_active = payload.is_active
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": str(product.id), "is_active": product.is_active}

@router.post("/products/{product_id}/variants")
def add_variant(
    product_id: uuid.UUID,
    payload: VariantCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role_ids(ADMIN_OR_SELLER)),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    _ensure_owner_or_admin(user, product)

    variant = ProductVariation(
        product_id=product.id,
        colour=payload.colour,
        size=payload.size,
        unit_price=payload.unit_price,
        stock=payload.stock,
        is_active=True,
    )
    db.add(variant)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Variant already exists for this product (colour+size).")

    db.refresh(variant)
    return variant

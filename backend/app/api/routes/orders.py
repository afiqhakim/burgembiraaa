import uuid
from decimal import Decimal
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.api.deps import get_db, get_current_user, require_role_ids
from app.models.user import User
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_variation import ProductVariation
from app.schemas.order import (
    OrderCreateOut,
    OrderItemCreate,
    OrderItemOut,
    OrderOut,
    OrderDetailOut,
    OrderStatusUpdate,
)

router = APIRouter(prefix="/orders", tags=["orders"])

SELLER_ROLE_IDS = {1, 2}


@router.post("", response_model=OrderCreateOut)
def create_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = Order(user_id=user.id, status="cart")
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.post("/{order_id}/items", response_model=OrderItemOut)
def add_item(
    order_id: uuid.UUID,
    payload: OrderItemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(and_(Order.id == order_id, Order.user_id == user.id)).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "cart":
        raise HTTPException(status_code=400, detail="Order is not editable")

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not available")

    unit_price = None
    if payload.variant_id:
        variant = (
            db.query(ProductVariation)
            .filter(ProductVariation.id == payload.variant_id)
            .filter(ProductVariation.product_id == product.id)
            .filter(ProductVariation.is_active.is_(True))
            .first()
        )
        if not variant:
            raise HTTPException(status_code=404, detail="Variant not found")
        if variant.stock < payload.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
        unit_price = variant.unit_price
    else:
        # If you require variants always, enforce it:
        raise HTTPException(status_code=400, detail="variant_id is required for this product")

    item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        variant_id=payload.variant_id,
        quantity=payload.quantity,
        unit_price=unit_price,  # snapshot price at time of add
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{order_id}/items/{item_id}")
def remove_item(
    order_id: uuid.UUID,
    item_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(and_(Order.id == order_id, Order.user_id == user.id)).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "cart":
        raise HTTPException(status_code=400, detail="Order is not editable")

    item = db.query(OrderItem).filter(and_(OrderItem.id == item_id, OrderItem.order_id == order.id)).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item removed"}


@router.get("/me", response_model=list[OrderOut])
def my_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderDetailOut)
def get_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(and_(Order.id == order_id, Order.user_id == user.id)).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    total = sum((Decimal(i.quantity) * i.unit_price for i in items), Decimal("0.00"))

    return {"order": order, "items": items, "total": total}


@router.post("/{order_id}/checkout")
def checkout(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(and_(Order.id == order_id, Order.user_id == user.id)).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "cart":
        raise HTTPException(status_code=400, detail="Order cannot be checked out")

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Reduce stock (simple approach)
    for item in items:
        if item.variant_id:
            variant = db.query(ProductVariation).filter(ProductVariation.id == item.variant_id).first()
            if not variant or not variant.is_active:
                raise HTTPException(status_code=400, detail="A variant is no longer available")
            if variant.stock < item.quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock during checkout")
            variant.stock -= item.quantity

    order.status = "paid"
    # If your model has paid_at with server_default only, set it here if needed:
    # order.paid_at = datetime.utcnow()
    order.paid_at = datetime.utcnow()

    db.commit()
    return {"message": "Checked out", "order_id": str(order.id)}


@router.post("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: uuid.UUID,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role_ids(SELLER_ROLE_IDS)),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if payload.status == "shipped":
        if order.status != "paid":
            raise HTTPException(status_code=400, detail="Only paid orders can be shipped")
        order.status = "shipped"
        order.shipped_at = datetime.utcnow()
    elif payload.status == "delivered":
        if order.status != "shipped":
            raise HTTPException(status_code=400, detail="Only shipped orders can be delivered")
        order.status = "delivered"
        order.delivered_at = datetime.utcnow()

    db.add(order)
    db.commit()
    db.refresh(order)
    return order

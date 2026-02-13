import uuid
from typing import Optional, Literal

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, asc, desc, and_

from app.db.session import SessionLocal
from app.models.product import Product
from app.models.product_variation import ProductVariation
from app.schemas.product import PaginatedProducts, ProductOut, ProductVariationOut

router = APIRouter(prefix="/products", tags=["products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=PaginatedProducts)
def list_products(
    db: Session = Depends(get_db),

    # pagination
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),

    # filters
    q: Optional[str] = Query(None, description="Search in product name"),
    user_id: Optional[uuid.UUID] = None,
    active_only: bool = True,

    colour: Optional[str] = None,
    size: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    in_stock_only: bool = False,

    # sorting
    sort_by: Literal["created_at", "name", "price"] = "created_at",
    sort_dir: Literal["asc", "desc"] = "desc",
):
    """
    Public product listing (buyer-facing).
    - Joins product_variations so we can filter by price/colour/size/stock.
    - Returns min_price/max_price/total_stock computed from variants.
    """

    # base query (join variants)
    base = db.query(Product).join(ProductVariation, ProductVariation.product_id == Product.id)

    conditions = []

    if active_only:
        conditions.append(Product.is_active.is_(True))
        conditions.append(ProductVariation.is_active.is_(True))

    if q:
        conditions.append(Product.name.ilike(f"%{q}%"))

    if user_id:
        conditions.append(Product.user_id == user_id)

    if colour:
        conditions.append(ProductVariation.colour.ilike(colour))

    if size:
        conditions.append(ProductVariation.size.ilike(size))

    if min_price is not None:
        conditions.append(ProductVariation.unit_price >= min_price)

    if max_price is not None:
        conditions.append(ProductVariation.unit_price <= max_price)

    if in_stock_only:
        conditions.append(ProductVariation.stock > 0)

    if conditions:
        base = base.filter(and_(*conditions))

    # total count of distinct products
    total = base.with_entities(func.count(func.distinct(Product.id))).scalar() or 0

    # sorting
    sort_fn = asc if sort_dir == "asc" else desc

    if sort_by == "name":
        base = base.order_by(sort_fn(Product.name))
    elif sort_by == "price":
        # sort by MIN variant price per product
        base = base.group_by(Product.id).order_by(sort_fn(func.min(ProductVariation.unit_price)))
    else:
        base = base.order_by(sort_fn(Product.created_at))

    # pagination
    offset = (page - 1) * page_size

    # load products + variants
    # If sort_by == "price" we already grouped; otherwise we may see duplicates due to join.
    # Easiest: select distinct product ids in a subquery, then fetch with joinedload.
    product_ids_subq = (
        base.with_entities(Product.id)
        .distinct()
        .offset(offset)
        .limit(page_size)
        .subquery()
    )

    products = (
        db.query(Product)
        .options(joinedload(Product.variations))
        .filter(Product.id.in_(product_ids_subq))
        .all()
    )

    # compute listing stats
    items = []
    for p in products:
        active_vars = [v for v in getattr(p, "variations", []) if (not active_only or v.is_active)]
        prices = [float(v.unit_price) for v in active_vars] if active_vars else []
        stocks = [int(v.stock) for v in active_vars] if active_vars else []

        out = ProductOut.model_validate(p)
        out.variants = [ProductVariationOut.model_validate(v) for v in active_vars]
        out.min_price = min(prices) if prices else None
        out.max_price = max(prices) if prices else None
        out.total_stock = sum(stocks) if stocks else 0
        items.append(out)

    return PaginatedProducts(items=items, total=total, page=page, page_size=page_size)


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: uuid.UUID, db: Session = Depends(get_db), active_only: bool = True):
    product = (
        db.query(Product)
        .options(joinedload(Product.variations))
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    out = ProductOut.model_validate(product)
    vars_all = getattr(product, "variations", [])
    if active_only:
        vars_all = [v for v in vars_all if v.is_active]
    out.variants = [ProductVariationOut.model_validate(v) for v in vars_all]

    prices = [float(v.unit_price) for v in vars_all]
    out.min_price = min(prices) if prices else None
    out.max_price = max(prices) if prices else None
    out.total_stock = sum(int(v.stock) for v in vars_all) if vars_all else 0
    return out

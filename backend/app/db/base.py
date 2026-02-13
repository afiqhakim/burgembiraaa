from sqlalchemy.orm import declarative_base

# SQLAlchemy base class for all models.
Base = declarative_base()

# Import all models here so Alembic and SQLAlchemy register them.
from app.models.role import Role  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.product import Product  # noqa: F401
from app.models.product_variation import ProductVariation  # noqa: F401
from app.models.order import Order  # noqa: F401
from app.models.order_item import OrderItem  # noqa: F401

import uuid
from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variations.id"), nullable=True)

    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)

    @property
    def total_price(self):
        return float(self.quantity) * float(self.unit_price)

import uuid
from sqlalchemy import Column, String, DateTime, func, Boolean, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class ProductVariation(Base):
    __tablename__ = "product_variations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)

    colour = Column(String, nullable=False)
    size = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=True)

    unit_price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    product = relationship("Product", back_populates="variations")

    __table_args__ = (
        UniqueConstraint("product_id", "colour", "size", name="uq_product_colour_size"),
    )
    def __repr__(self) -> str:
        return f"<ProductVariation(id={self.id}, product_id={self.product_id}, colour={self.colour!r}, size={self.size!r}, sku={self.sku!r})>"
    
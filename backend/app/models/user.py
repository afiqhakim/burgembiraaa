import uuid
from sqlalchemy import Column, String, DateTime, func, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True)  # stores the filename/path
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False, default=3)  # default to 'customer' role
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

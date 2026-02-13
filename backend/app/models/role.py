from sqlalchemy import Column, String, Integer
from app.db.base import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, unique=True, nullable=False)   # admin/seller/customer
    role_access = Column(String, nullable=True)               # optional: JSON later

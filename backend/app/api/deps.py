from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.api.routes.auth import get_current_user  # reuse your existing auth dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def require_role_ids(allowed: set[int]):
    def _checker(user: User = Depends(get_current_user)) -> User:
        if user.role_id not in allowed:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return _checker

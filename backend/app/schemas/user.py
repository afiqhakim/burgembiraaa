from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str | None = None
    profile_picture: str | None = None
    role_id: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

class UserUpdate(BaseModel):
    name: str | None = None
    password: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


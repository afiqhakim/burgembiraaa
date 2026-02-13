from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import shutil
from pathlib import Path
import uuid


from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, Token
from app.core.security import hash_password, verify_password, create_access_token

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

router = APIRouter(tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut(id=str(user.id), email=user.email)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        profile_picture=current_user.profile_picture,
        role_id=current_user.role_id,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.put("/update-profile", response_model=UserOut)
def update_profile(
    name: str | None = None,
    password: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile (name and/or password)"""
    if name:
        current_user.name = name
    if password:
        current_user.hashed_password = hash_password(password)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return UserOut(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        profile_picture=current_user.profile_picture,
        role_id=current_user.role_id,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

MAX_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/gif"}

@router.post("/upload-profile-picture")
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1) basic content-type check
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpeg, png, gif")

    upload_dir = Path("uploads/profiles")
    upload_dir.mkdir(parents=True, exist_ok=True)

    # 2) unique filename (don’t overwrite older one)
    ext = Path(file.filename).suffix.lower()
    filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_path = upload_dir / filename

    # 3) save with size cap
    size = 0
    with open(file_path, "wb") as buffer:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > MAX_SIZE:
                buffer.close()
                file_path.unlink(missing_ok=True)
                raise HTTPException(status_code=400, detail="File too large (max 5MB)")
            buffer.write(chunk)

    current_user.profile_picture = f"/uploads/profiles/{filename}"
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile picture uploaded successfully",
        "profile_picture": current_user.profile_picture,
    }


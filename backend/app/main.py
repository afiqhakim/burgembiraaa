from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

from app.db import base  # this imports all models (side-effect)

from app.db.session import engine
from app.db.base import Base
from app.models.user import User  # ensures model is registered
from app.api.routes.auth import router as auth_router
from app.api.routes.seller import router as seller_router
from app.api.routes.products import router as products_router
from app.api.routes.orders import router as orders_router

app = FastAPI()

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
allow_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for serving static files
Path("uploads/profiles").mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(seller_router)
app.include_router(products_router)
app.include_router(orders_router)


@app.get("/")
def root():
    return {"status": "ok"}


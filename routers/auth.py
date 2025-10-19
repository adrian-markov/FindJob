
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
import os

from db import get_db
from model import User
from passwords import hash_password, verify_password  

router = APIRouter(prefix="/auth", tags=["auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-.env")
JWT_ALGO = os.getenv("JWT_ALGO", "HS256")
JWT_EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MIN", "60"))  # 60 min

def create_access_token(sub: str | int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(sub),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=JWT_EXPIRE_MIN)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

class SignupIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone: str | None = None
    role: str | None = "applicant"   

class UserOut(BaseModel):
    id_user: int
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    role: str
    class Config:
        from_attributes = True

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id: int
    email: str
    role: str

@router.post("/signup", response_model=UserOut, status_code=201)
async def signup(payload: SignupIn, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Email déjà utilisé")

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        phone=payload.phone,
        role=payload.role or "applicant",
        password=hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == payload.email))
    user = res.scalar_one_or_none()
    if not user or not user.password or not verify_password(payload.password, user.password):
        raise HTTPException(401, "Email ou mot de passe invalide")

    token = create_access_token(sub=user.id_user)
    
    return TokenOut(
        access_token=token,
        id=user.id_user,
        email=user.email,
        role=user.role
    )

bearer = HTTPBearer()

async def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = cred.credentials
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        sub = data.get("sub")
        if not sub:
            raise HTTPException(401, "Token invalide")
    except JWTError:
        raise HTTPException(401, "Token invalide")

    res = await db.execute(select(User).where(User.id_user == int(sub)))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(401, "Utilisateur introuvable")
    return user

@router.get("/me", response_model=UserOut)
async def me(current: User = Depends(get_current_user)):
    return current

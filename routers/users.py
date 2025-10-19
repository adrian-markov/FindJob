
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError, DataError
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime as dt
from sqlalchemy import delete
import bcrypt  

from db import get_db
from model import User

router = APIRouter(prefix="/users", tags=["users"])


class UserOut(BaseModel):
    id_user: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    role: str
    date_created: Optional[dt] = None
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    password: Optional[str] = Field(None, max_length=72)  
    role: Optional[str] = "applicant"

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = Field(None, max_length=72)
    role: Optional[str] = None

#ici on utilise bcrypt (se renseigner sur le fonctionnement)
def hash_password(pwd: Optional[str]) -> Optional[str]:
    if not pwd:
        return None
    
    raw = pwd[:72].encode("utf-8")
    return bcrypt.hashpw(raw, bcrypt.gensalt()).decode("utf-8")


@router.get("", response_model=List[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).order_by(User.id_user))
    return res.scalars().all()

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.id_user == user_id))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "User not found")
    return user

@router.post("", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    data = payload.model_dump()
    if data.get("password"):
        data["password"] = hash_password(data["password"])
    user = User(**data)
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
        return user
    except IntegrityError as e:
        await db.rollback()
        return JSONResponse(status_code=409, content={"error": "IntegrityError", "detail": str(e.orig)})
    except DataError as e:
        await db.rollback()
        return JSONResponse(status_code=400, content={"error": "DataError", "detail": str(e.orig)})

@router.patch("/{user_id}", response_model=UserOut)
async def update_user(user_id: int, payload: UserUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.id_user == user_id))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "User not found")

    data = payload.model_dump(exclude_unset=True)
    if data.get("password"):
        data["password"] = hash_password(data["password"])

    for k, v in data.items():
        setattr(user, k, v)

    try:
        await db.commit()
        await db.refresh(user)
        return user
    except IntegrityError as e:
        await db.rollback()
        return JSONResponse(status_code=409, content={"error": "IntegrityError", "detail": str(e.orig)})
    except DataError as e:
        await db.rollback()
        return JSONResponse(status_code=400, content={"error": "DataError", "detail": str(e.orig)})

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id_user == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return


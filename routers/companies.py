
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List

from db import get_db
from model import Company

router = APIRouter(prefix="/companies", tags=["companies"])

class CompanyOut(BaseModel):
    id_company: int
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    sector: Optional[str] = None
    email_contact: Optional[str] = None
    logo_url: Optional[str] = None
    class Config: from_attributes = True

class CompanyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    sector: Optional[str] = None
    email_contact: Optional[str] = None
    logo_url: Optional[str] = None

class CompanyUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    sector: Optional[str] = None
    email_contact: Optional[str] = None
    logo_url: Optional[str] = None

@router.get("", response_model=List[CompanyOut])
async def list_companies(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Company).order_by(Company.id_company))
    return res.scalars().all()

@router.get("/{company_id}", response_model=CompanyOut)
async def get_company(company_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Company).where(Company.id_company == company_id))
    company = res.scalar_one_or_none()
    if not company:
        raise HTTPException(404, "Company not found")
    return company

@router.post("", response_model=CompanyOut, status_code=201)
async def create_company(payload: CompanyCreate, db: AsyncSession = Depends(get_db)):
    company = Company(**payload.model_dump())
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company

@router.delete("/{company_id}", status_code=204)
async def delete_company(company_id: int, db: AsyncSession = Depends(get_db)):
    await db.execute(delete(Company).where(Company.id_company == company_id))
    await db.commit()
    return

@router.patch("/{company_id}", response_model=CompanyOut)
async def company_Update(company_id: int, payload: CompanyUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Company).where(Company.id_company == company_id))
    company = res.scalar_one_or_none()
    if not company:
        raise HTTPException(404, "Company not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(company, k, v)
    await db.commit()
    await db.refresh(company)    
    return company 
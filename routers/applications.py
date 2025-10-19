
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime as dt

from db import get_db
from model import Application

router = APIRouter(prefix="/applications", tags=["applications"])


class ApplicationOut(BaseModel):
    id_application: int
    id_ad: int
    id_applicant: int
    message: Optional[str] = None
    date_applied: Optional[dt] = None
    status: Optional[str] = None
    cv_url: Optional[str] = None
    email_sent: Optional[bool] = None
    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    id_ad: int
    id_applicant: int
    message: Optional[str] = None
    status: Optional[str] = "pending"
    cv_url: Optional[str] = None
    email_sent: Optional[bool] = False




@router.get("", response_model=List[ApplicationOut])
async def list_applications(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Application).order_by(Application.id_application))
    return res.scalars().all()


@router.post("", response_model=ApplicationOut, status_code=201)
async def create_application(payload: ApplicationCreate, db: AsyncSession = Depends(get_db)):
    app_obj = Application(
        id_ad=payload.id_ad,
        id_applicant=payload.id_applicant,
        message=payload.message,
        status=payload.status,
        cv_url=payload.cv_url,
        email_sent=payload.email_sent,
        date_applied=dt.utcnow(),
    )
    db.add(app_obj)
    await db.commit()
    await db.refresh(app_obj)
    return app_obj


@router.get("/by-job/{job_id}", response_model=List[ApplicationOut])
async def list_applications_by_job(job_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Application).where(Application.id_ad == job_id))
    return res.scalars().all()


from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime as dt

from db import get_db
from model import JobAd

router = APIRouter(prefix="/jobs", tags=["jobs"])


class JobOut(BaseModel):
    id_ad: int
    title: str
    description: str
    contract_type: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[float] = None
    date_posted: Optional[dt] = None
    remote: Optional[bool] = None
    experience_level: Optional[str] = None
    id_company: Optional[int] = None
    id_contact_user: Optional[int] = None

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str
    description: str
    contract_type: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[float] = None
    remote: Optional[bool] = None
    experience_level: Optional[str] = None
    id_company: Optional[int] = None
    id_contact_user: Optional[int] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    contract_type: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[float] = None
    remote: Optional[bool] = None
    experience_level: Optional[str] = None
    id_company: Optional[int] = None
    id_contact_user: Optional[int] = None



@router.get("", response_model=List[JobOut])
async def list_jobs(
    q: Optional[str] = Query(None),
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(JobAd)
        .order_by(JobAd.date_posted.desc())
        .limit(limit)
        .offset(offset)
    )
    if q:
        like = f"%{q}%"
        stmt = stmt.where((JobAd.title.ilike(like)) | (JobAd.description.ilike(like)))

    jobs = (await db.execute(stmt)).scalars().all()

   
    return [
        JobOut(
            id_ad=j.id_ad,
            title=j.title,
            description=j.description,
            contract_type=j.contract_type,
            location=j.location,
            salary=float(j.salary) if j.salary is not None else None,
            date_posted=j.date_posted,
            remote=j.remote,
            experience_level=j.experience_level,
            id_company=j.id_company,
            id_contact_user=j.id_contact_user,
        )
        for j in jobs
    ]


@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(JobAd).where(JobAd.id_ad == job_id))
    job = res.scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")
    return JobOut(
        id_ad=job.id_ad,
        title=job.title,
        description=job.description,
        contract_type=job.contract_type,
        location=job.location,
        salary=float(job.salary) if job.salary is not None else None,
        date_posted=job.date_posted,
        remote=job.remote,
        experience_level=job.experience_level,
        id_company=job.id_company,
        id_contact_user=job.id_contact_user,
    )


@router.post("", response_model=JobOut, status_code=201)
async def create_job(payload: JobCreate, db: AsyncSession = Depends(get_db)):
    job = JobAd(**payload.model_dump())
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return JobOut(
        id_ad=job.id_ad,
        title=job.title,
        description=job.description,
        contract_type=job.contract_type,
        location=job.location,
        salary=float(job.salary) if job.salary is not None else None,
        date_posted=job.date_posted,
        remote=job.remote,
        experience_level=job.experience_level,
        id_company=job.id_company,
        id_contact_user=job.id_contact_user,
    )


@router.patch("/{job_id}", response_model=JobOut)
async def update_job(job_id: int, payload: JobUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(JobAd).where(JobAd.id_ad == job_id))
    job = res.scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(job, k, v)

    await db.commit()
    await db.refresh(job)
    return JobOut(
        id_ad=job.id_ad,
        title=job.title,
        description=job.description,
        contract_type=job.contract_type,
        location=job.location,
        salary=float(job.salary) if job.salary is not None else None,
        date_posted=job.date_posted,
        remote=job.remote,
        experience_level=job.experience_level,
        id_company=job.id_company,
        id_contact_user=job.id_contact_user,
    )


@router.delete("/{job_id}", status_code=204)
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    await db.execute(delete(JobAd).where(JobAd.id_ad == job_id))
    await db.commit()
    return


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional

from db import get_db
from model import JobTechnology, JobAd  

router = APIRouter(prefix="/job-technologies", tags=["job_technologies"])


class JobTechnologyOut(BaseModel):
    id: int
    id_job: Optional[int] = None
    technology: Optional[str] = None
    class Config:
        from_attributes = True

class JobTechnologyCreate(BaseModel):
    id_job: int
    technology: str

class JobTechnologyBulkCreate(BaseModel):
    id_job: int
    technologies: List[str]




@router.get("", response_model=List[JobTechnologyOut])
async def list_all(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(JobTechnology).order_by(JobTechnology.id))
    return res.scalars().all()


@router.get("/by-job/{job_id}", response_model=List[str])
async def list_by_job(job_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(JobTechnology).where(JobTechnology.id_job == job_id))
    return [t.technology for t in res.scalars().all() if t.technology]


@router.post("", response_model=JobTechnologyOut, status_code=201)
async def create_one(payload: JobTechnologyCreate, db: AsyncSession = Depends(get_db)):
    row = JobTechnology(id_job=payload.id_job, technology=payload.technology)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row




@router.delete("/{tech_id}", status_code=204)
async def delete_one(tech_id: int, db: AsyncSession = Depends(get_db)):
    await db.execute(delete(JobTechnology).where(JobTechnology.id == tech_id))
    await db.commit()
    return



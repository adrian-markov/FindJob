from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.companies import router as companies_router
from routers.jobs import router as jobs_router
from routers.users import router as users_router
from routers.applications import router as applications_router
from routers.job_technologies import router as job_tech_router
from routers.auth import router as auth_router


app = FastAPI(title="Job Board API", version="lite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok"}

app.include_router(companies_router)
app.include_router(jobs_router)
app.include_router(users_router)
app.include_router(applications_router)
app.include_router(job_tech_router)
app.include_router(auth_router)


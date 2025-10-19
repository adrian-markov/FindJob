
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str = "job_board"

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

DATABASE_URL = (
    f"mysql+asyncmy://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}"
    f"@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}"
    f"?charset=utf8mb4"
)

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,  
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

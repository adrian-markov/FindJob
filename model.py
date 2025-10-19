
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Enum, DateTime, ForeignKey, Numeric, Boolean

class Base(DeclarativeBase):
    pass


class Company(Base):
    __tablename__ = "Company"

    id_company: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String(100))
    address: Mapped[str | None] = mapped_column(String(100))
    sector: Mapped[str | None] = mapped_column(String(100))
    email_contact: Mapped[str | None] = mapped_column(String(100))
    logo_url: Mapped[str | None] = mapped_column(String(100))

    jobs: Mapped[list["JobAd"]] = relationship(
        back_populates="company", cascade="all,delete-orphan", passive_deletes=True
    )

class User(Base):
    __tablename__ = "Users"

    id_user: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100), unique=True)
    phone: Mapped[str | None] = mapped_column(String(15))
    password: Mapped[str | None] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(Enum('admin','recruiter','applicant'))
    date_created: Mapped[DateTime | None] = mapped_column(DateTime)

    contact_jobs: Mapped[list["JobAd"]] = relationship(
        back_populates="contact_user", primaryjoin="User.id_user==JobAd.id_contact_user"
    )


class JobAd(Base):
    __tablename__ = "Job_Ad"

    id_ad: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    contract_type: Mapped[str | None] = mapped_column(String(50))
    location: Mapped[str | None] = mapped_column(String(100))
    salary: Mapped[Numeric | None] = mapped_column(Numeric(10, 2))
    date_posted: Mapped[DateTime | None] = mapped_column(DateTime)
    remote: Mapped[bool | None] = mapped_column(Boolean)
    experience_level: Mapped[str | None] = mapped_column(Enum('junior','mid','senior'))
    id_company: Mapped[int | None] = mapped_column(ForeignKey("Company.id_company", ondelete="SET NULL"))
    id_contact_user: Mapped[int | None] = mapped_column(ForeignKey("Users.id_user", ondelete="SET NULL"))

    company: Mapped[Company | None] = relationship(back_populates="jobs")
    contact_user: Mapped[User | None] = relationship(back_populates="contact_jobs")
    technologies: Mapped[list["JobTechnology"]] = relationship(back_populates="job", cascade="all,delete-orphan", passive_deletes=True)
    applications: Mapped[list["Application"]] = relationship(back_populates="job", cascade="all,delete-orphan", passive_deletes=True)


class JobTechnology(Base):
    __tablename__ = "Job_Technology"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_job: Mapped[int | None] = mapped_column(ForeignKey("Job_Ad.id_ad", ondelete="CASCADE"))
    technology: Mapped[str | None] = mapped_column(String(100))

    job: Mapped[JobAd | None] = relationship(back_populates="technologies")


class Application(Base):
    __tablename__ = "Application"

    id_application: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_ad: Mapped[int | None] = mapped_column(ForeignKey("Job_Ad.id_ad", ondelete="CASCADE"))
    id_applicant: Mapped[int | None] = mapped_column(ForeignKey("Users.id_user", ondelete="CASCADE"))
    message: Mapped[str | None] = mapped_column(Text)
    date_applied: Mapped[DateTime | None] = mapped_column(DateTime)
    status: Mapped[str | None] = mapped_column(Enum('pending','accepted','rejected'))
    cv_url: Mapped[str | None] = mapped_column(String(255))
    email_sent: Mapped[bool | None] = mapped_column(Boolean)

    job: Mapped[JobAd | None] = relationship(back_populates="applications")

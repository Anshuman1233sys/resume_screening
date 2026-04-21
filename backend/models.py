from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Candidate(Base):
    __tablename__ = 'candidates'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Unknown Name")
    email = Column(String, default="")
    phone = Column(String, default="")
    location = Column(String, default="")
    role = Column(String, default="")
    experience_years = Column(Integer, default=0)
    education = Column(String, default="")
    skills = Column(Text, default="[]") # Store as JSON string
    match_score = Column(Float, default=0.0)
    standout_points = Column(Text, default="[]") # Store as JSON string
    status = Column(String, default="evaluating") # evaluating, shortlisted, rejected

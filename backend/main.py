from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import List
import json
from models import Base, Candidate
from utils import extract_text_from_pdf, extract_text_from_docx, analyze_with_gemini

# DB setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./candidates.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/upload")
async def upload_resumes(
    job_description: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    processed = []
    
    for file in files:
        contents = await file.read()
        filename = file.filename.lower()
        
        text = ""
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(contents)
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(contents)
        elif filename.endswith(".txt"):
            text = contents.decode('utf-8')
        
        if text.strip():
            # Analyze with Gemini
            analysis = analyze_with_gemini(job_description, text)
            
            # Use filename as fallback for name if Gemini fails
            name = analysis.get("name")
            if not name or name == "Unknown":
                name = file.filename
                
            db_candidate = Candidate(
                name=name,
                email=analysis.get("email", ""),
                phone=analysis.get("phone", ""),
                location=analysis.get("location", ""),
                role=analysis.get("role", "Unknown"),
                experience_years=analysis.get("experience_years", 0),
                education=analysis.get("education", ""),
                skills=json.dumps(analysis.get("skills", [])),
                match_score=analysis.get("match_score", 0),
                standout_points=json.dumps(analysis.get("standout_points", [])),
                status="shortlisted" if analysis.get("match_score", 0) >= 70 else "evaluating"
            )
            db.add(db_candidate)
            db.commit()
            db.refresh(db_candidate)
            processed.append(db_candidate.id)
            
    return {"message": f"Successfully processed {len(processed)} resumes.", "ids": processed}

@app.get("/api/candidates")
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).order_by(Candidate.match_score.desc()).all()
    results = []
    for c in candidates:
        results.append({
            "id": c.id,
            "name": c.name,
            "role": c.role,
            "match_score": c.match_score,
            "experience_years": c.experience_years,
            "skills": json.loads(c.skills),
            "status": c.status
        })
    return results

@app.get("/api/shortlisted")
def get_shortlisted(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).filter(Candidate.status == 'shortlisted').order_by(Candidate.match_score.desc()).all()
    results = []
    for c in candidates:
        results.append({
            "id": c.id,
            "name": c.name,
            "role": c.role,
            "email": c.email,
            "phone": c.phone,
            "location": c.location,
            "match_score": c.match_score,
            "experience_years": c.experience_years,
            "education": c.education,
            "skills": json.loads(c.skills),
            "standout_points": json.loads(c.standout_points),
            "status": c.status
        })
    return results

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).filter(Candidate.status == 'shortlisted').all()
    if not candidates:
         return {"average_score": 0, "avg_experience": 0, "ready_to_interview": 0}
         
    total_score = sum(c.match_score for c in candidates)
    total_exp = sum(c.experience_years for c in candidates)
    count = len(candidates)
    
    return {
        "average_score": round(total_score / count),
        "avg_experience": round(total_exp / count, 1),
        "ready_to_interview": count
    }

@app.delete("/api/candidates/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if candidate:
        db.delete(candidate)
        db.commit()
        return {"success": True}
    raise HTTPException(status_code=404, detail="Candidate not found")

@app.post("/api/login")
def login():
    # Mock authentication MVP
    return {"success": True, "token": "mock-jwt-token-123"}

@app.get("/api/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Compute or mock stats
    total = db.query(Candidate).count()
    shortlisted = db.query(Candidate).filter(Candidate.status == 'shortlisted').count()
    rate = round((shortlisted / total * 100) if total > 0 else 0, 1)
    
    return {
        "total_candidates": {"value": total, "change": "+0%"},
        "shortlisted": {"value": shortlisted, "change": "+0%"},
        "screening_rate": {"value": f"{rate}%", "change": "+0%"},
        "avg_processing": {"value": "0.4 min", "change": "-0%"}
    }

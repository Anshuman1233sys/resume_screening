import io
import json
import os
import PyPDF2
import docx2txt
from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Define strict Pydantic JSON schema expected by the webapp
class CandidateAnalysis(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    role: str
    experience_years: int
    education: str
    skills: list[str]
    match_score: int
    standout_points: list[str]

# Configure the new Gemini SDK Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_text_from_pdf(file_bytes):
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page_num in range(len(reader.pages)):
            page_text = reader.pages[page_num].extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def extract_text_from_docx(file_bytes):
    try:
        text = docx2txt.process(io.BytesIO(file_bytes))
        return text
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""

def analyze_with_gemini(job_description, resume_text):
    prompt = f"""
You are an expert HR Technical Recruiter. Analyze the following resume against the provided Job Description.

Job Description:
{job_description}

Resume Text:
{resume_text}

Make a fair and strict evaluation.
"""
    try:
        # Generate with strict JSON schema enforcing
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": CandidateAnalysis,
            }
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "name": "Unknown",
            "email": "",
            "phone": "",
            "location": "",
            "role": "Unknown",
            "experience_years": 0,
            "education": "",
            "skills": [],
            "match_score": 0,
            "standout_points": [f"Error evaluating candidate: {e}"]
        }

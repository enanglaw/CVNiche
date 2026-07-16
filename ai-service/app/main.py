import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.services.ats_optimizer import analyze_ats, tailor_resume
from app.services.linkedin_optimizer import optimize_linkedin
from app.services.career_coach import get_coach_reply
from app.services.job_matcher import match_jobs

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cvniche-ai")

app = FastAPI(
    title="CVNiche AI Services",
    description="Python AI Backend microservice backing CVNiche resume ATS, LinkedIn reviews and coaching",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schemas
class ATSAnalyzeRequest(BaseModel):
    resume_content: Dict[str, Any]
    job_description: str

class LinkedInOptimizeRequest(BaseModel):
    profile: Dict[str, Any]

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class CoachChatRequest(BaseModel):
    messages: List[ChatMessage]

class JobItem(BaseModel):
    id: str
    title: str
    company: str
    descriptionText: str
    embedding: Optional[List[float]] = None

class JobMatchRequest(BaseModel):
    resume_text: str
    jobs: List[JobItem]


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "cvniche-ai"}


@app.post("/api/ats/analyze")
def api_analyze_ats(req: ATSAnalyzeRequest):
    try:
        return analyze_ats(req.resume_content, req.job_description)
    except Exception as e:
        logger.error(f"Error analyzing ATS: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ats/tailor")
def api_tailor_resume(req: ATSAnalyzeRequest):
    try:
        return tailor_resume(req.resume_content, req.job_description)
    except Exception as e:
        logger.error(f"Error tailoring resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/linkedin/optimize")
def api_optimize_linkedin(req: LinkedInOptimizeRequest):
    try:
        return optimize_linkedin(req.profile)
    except Exception as e:
        logger.error(f"Error optimizing LinkedIn: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/coach/chat")
def api_coach_chat(req: CoachChatRequest):
    try:
        # Convert Pydantic list to standard dict list
        dict_messages = [{"role": msg.role, "content": msg.content} for msg in req.messages]
        reply = get_coach_reply(dict_messages)
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Error in coach chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/jobs/match")
def api_match_jobs(req: JobMatchRequest):
    try:
        # Convert Pydantic list to standard dict list
        dict_jobs = []
        for job in req.jobs:
            dict_jobs.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "descriptionText": job.descriptionText,
                "embedding": job.embedding
            })
        return match_jobs(req.resume_text, dict_jobs)
    except Exception as e:
        logger.error(f"Error matching jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

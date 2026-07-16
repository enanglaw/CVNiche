import math
from .gemini import gemini_service

def get_embedding(text: str) -> list[float]:
    return gemini_service.get_embeddings(text)

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
        
    dot_product = sum(a * b for a, b in zip(v1, v2))
    magnitude_v1 = math.sqrt(sum(a * a for a in v1))
    magnitude_v2 = math.sqrt(sum(b * b for b in v2))
    
    if not magnitude_v1 or not magnitude_v2:
        return 0.0
        
    return dot_product / (magnitude_v1 * magnitude_v2)

def match_jobs(resume_text: str, jobs: list[dict]) -> list[dict]:
    # Compute resume embedding
    resume_emb = get_embedding(resume_text)
    
    matches = []
    for job in jobs:
        # If job doesn't have an embedding, compute it
        job_emb = job.get("embedding")
        if not job_emb:
            job_emb = get_embedding(job.get("descriptionText", ""))
            
        sim = cosine_similarity(resume_emb, job_emb)
        match_pct = int(sim * 100)
        
        matches.append({
            "job_id": job.get("id"),
            "title": job.get("title"),
            "company": job.get("company"),
            "match_score": match_pct,
            "interview_probability": max(5, min(95, int(match_pct * 1.05 - 5))) # Estimated probability
        })
        
    return sorted(matches, key=lambda x: x["match_score"], reverse=True)

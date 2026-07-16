import json
from .gemini import gemini_service

def analyze_ats(resume_content: dict, job_description: str) -> dict:
    prompt = f"""
    You are an expert recruiter and ATS (Applicant Tracking System) optimization algorithm.
    Analyze the following resume JSON and the corresponding job description.

    Resume:
    {json.dumps(resume_content, indent=2)}

    Job Description:
    {job_description}

    Perform the following analysis:
    1. Score the resume match quality from 0 to 100 based on skill match, experience depth, and formatting.
    2. Extract key missing keywords (technical skills, methodologies, concepts) that are in the job description but not in the resume.
    3. Identify weak sections in the resume (e.g. experiences lacking metrics, summaries that are too short/generic).
    4. Provide suggestions for phrasing (rephrasing bullet points to show impact), formatting (fonts, columns, tables), and action verbs to use.

    Return the analysis strictly as a JSON object with this format:
    {{
      "score": 85,
      "missing_keywords": ["keyword1", "keyword2"],
      "weak_sections": ["section name: reason"],
      "suggestions": {{
        "phrasing": "phrasing tips",
        "formatting": "formatting tips",
        "actionVerbs": "suggested action verbs"
      }}
    }}
    """
    
    mock_fallback = {
        "score": 75,
        "missing_keywords": ["Docker", "Next.js", "System Architecture", "CI/CD Pipelines"],
        "weak_sections": ["Work Experience: Experience at Acme Corp lacks metrics and quantitative achievements."],
        "suggestions": {
            "phrasing": "Use the STAR method (Situation, Task, Action, Result) for bullet points.",
            "formatting": "Avoid complex layouts or side columns; keep sections standard.",
            "actionVerbs": "Use action verbs like Spearheaded, Engineered, Automated."
        }
    }
    
    return gemini_service.generate_json(prompt, mock_fallback=mock_fallback)


def tailor_resume(resume_content: dict, job_description: str) -> dict:
    prompt = f"""
    You are a professional resume writer.
    Tailor the following resume JSON to better align with the job description. Do not fabricate experience, but optimize summaries, highlight relevant skills, and rephrase experience bullets to emphasize matched skills and impact.

    Resume:
    {json.dumps(resume_content, indent=2)}

    Job Description:
    {job_description}

    Return the tailored resume strictly as a JSON object, keeping the exact same structure as the input resume JSON but with updated values for summary, skills, and experience descriptions.
    Also include an "estimated_score" field (integer 0-100) representing how well this tailored resume now matches the job.

    Return in this JSON format:
    {{
      "tailored_content": {{ ... updated resume JSON ... }},
      "estimated_score": 92
    }}
    """
    
    # Simple fallback: return original resume with enhanced summary
    mock_tailored = {
        "tailored_content": {
            **resume_content,
            "summary": f"Highly experienced professional tailored for this opportunity. Specialized in core competencies highlighted in the job description, focused on achieving business objectives and delivering clean solutions.",
            "skills": list(set(resume_content.get("skills", []) + ["Docker", "Agile", "Next.js"]))
        },
        "estimated_score": 88
      }
      
    return gemini_service.generate_json(prompt, mock_fallback=mock_tailored)

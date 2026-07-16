import json
from .gemini import gemini_service

def optimize_linkedin(profile: dict) -> dict:
    prompt = f"""
    You are an expert LinkedIn profile optimizer and personal branding coach.
    Analyze the following professional profile data and provide improvements.

    Profile:
    {json.dumps(profile, indent=2)}

    Tasks:
    1. Write 3 compelling, SEO-optimized headlines (e.g. incorporating key skills, roles, and value propositions).
    2. Write a highly engaging "About" summary that tells a story and lists core competencies.
    3. Suggest enhancements for experiences (rephrasing titles or descriptions to showcase achievements).
    4. Provide 3 custom tips to improve LinkedIn search visibility and network quality.

    Return the improvements strictly as a JSON object with this format:
    {{
      "headline": "Recommended Headline 1 | Key Skill | Key Skill",
      "about": "Engaging About Summary text...",
      "experience_improvements": [
        {{
          "id": "experience_id",
          "company": "Company Name",
          "original": "Original description...",
          "improved": "Improved description showing impact..."
        }}
      ],
      "seo_score": 88,
      "network_tips": ["tip1", "tip2", "tip3"]
    }}
    """
    
    mock_fallback = {
        "headline": "Senior Full-Stack Engineer | React, Node.js, Python | Building Scalable SaaS Systems",
        "about": "Dedicated software engineer with over 5 years of experience building scalable applications. Expertise in frontend design and backend engineering, with a passion for clean code and performance optimization.",
        "experience_improvements": [
            {
                "id": "mock-exp-1",
                "company": "Previous Tech Inc",
                "original": "Worked on the client web application.",
                "improved": "Refactored the core web client application, resulting in a 40% page load speedup and improving active user retention by 15%."
            }
        ],
        "seo_score": 80,
        "network_tips": [
            "Use clear keywords in your headline instead of just a generic title.",
            "Write your about section in the first person to keep it personal and engaging.",
            "List your top 5 technical skills in the skills section to show search algorithms your capabilities."
        ]
    }
    
    return gemini_service.generate_json(prompt, mock_fallback=mock_fallback)

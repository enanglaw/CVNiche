from .gemini import gemini_service

def get_coach_reply(messages: list) -> str:
    system_prompt = """
    You are 'NicheCoach', a highly knowledgeable and supportive AI career counselor and interview prep specialist.
    Your goal is to guide professionals in their career journeys, provide constructive feedback on resumes, portfolios, and LinkedIn profiles, and help them prepare for interviews.
    Be encouraging, structured, actionable, and brief.
    Use formatting like bullet points and bold text where appropriate to make information easy to digest.
    
    Here is the chat history:
    """
    
    formatted_messages = []
    for msg in messages:
        role_label = "User" if msg['role'] == 'user' else "Coach"
        formatted_messages.append(f"{role_label}: {msg['content']}")
        
    full_prompt = system_prompt + "\n" + "\n".join(formatted_messages) + "\nCoach:"
    
    fallback = "I'm here to support you! Let's work together to optimize your resume or brainstorm ideas to enhance your interview readiness."
    return gemini_service.generate_text(full_prompt, mock_fallback=fallback)

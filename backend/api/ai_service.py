# backend/api/ai_service.py
import google.generativeai as genai
import os

# CONFIGURATION
# Read Gemini API key from environment; settings.py loads `.env`.
GEN_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEN_API_KEY:
    # Fail fast to make misconfiguration obvious during development
    raise RuntimeError("GEMINI_API_KEY is not set in environment.")

genai.configure(api_key=GEN_API_KEY)

def generate_note_extras(content):
    """
    Sends the note content to Gemini and asks for Title, Summary, and Tags.
    """
    model = genai.GenerativeModel('gemini-2.0-flash')  # Use Gemini 2.0 Flash model
    
    # We give the AI strict instructions on how to format the answer
    prompt = (
        f"Read this note: '{content}'. \n"
        "Generate 3 things: A short creative Title, a 1-sentence Summary, and 3 comma-separated Tags. \n"
        "Return them exactly in this format using pipes: Title | Summary | Tags"
    )

    try:
        response = model.generate_content(prompt)
        text = response.text
        
        # Parse the result (The AI returns a string, we cut it into pieces)
        # Example: "Gym Plan | Workout routine for monday | health, gym, fit"
        parts = text.split('|')
        
        return {
            "ai_title": parts[0].strip(),
            "ai_summary": parts[1].strip() if len(parts) > 1 else "",
            "ai_tags": parts[2].strip() if len(parts) > 2 else ""
        }
    except Exception as e:
        # If AI fails (e.g., no internet), return empty strings so the app doesn't crash
        print(f"AI Error: {e}")
        return {
            "ai_title": "Untitled Note",
            "ai_summary": "Could not generate summary.",
            "ai_tags": ""
        }
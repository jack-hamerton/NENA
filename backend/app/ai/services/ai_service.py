
import random
from sqlalchemy.orm import Session
from app.crud.user import user as crud_user
from app.crud.room import room as crud_room
from app.ai.services.transcription import transcribe_voice
from app.ai.services.chat_memory import get_chat_history, add_to_chat_history
from app.ai.prompts import REWRITE_PROMPTS
from app.ai.services.knowledge_service import get_knowledge, learn_from_public_sources
# from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Initialize ML models
try:
    # Summarization model
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # Text generation model for suggestions
    generator = pipeline("text-generation", model="gpt2")
    
    # Sentiment analysis
    sentiment_analyzer = pipeline("sentiment-analysis")
    
    print("AI/ML models loaded successfully")
except Exception as e:
    print(f"Error loading AI models: {e}")
    summarizer = None
    generator = None
    sentiment_analyzer = None

def assist_user(db: Session, prompt: str, user_id: int, context: dict = None):
    """
    Processes a user's prompt, contextualizes it, and returns an action or a response.
    """
    prompt = prompt.lower().strip()
    user_profile = crud_user.get(db, id=user_id)

    if prompt.startswith("learn about"):
        topic = prompt.replace("learn about", "").strip()
        if not topic:
            return {"response": "Please specify what you want me to learn about. For example: 'learn about climate change'."}
        response = learn_from_public_sources(topic)
        return {"response": response}

    if context and context.get("type") == "room":
        room_id = context.get("id")
        return assist_in_room(db, prompt, user_profile, room_id)
    
    if context and context.get("type") == "rewrite":
        return rewrite_text(db, prompt, user_id, context)

    if context and context.get("type") == "summarize":
        return summarize(db, prompt, user_id, context)

    if context and context.get("type") == "suggest_next_steps":
        return suggest_next_steps(db, prompt, user_id, context)

    if "help" in prompt:
        return {
            "response": "I'm Kenyan, your AI assistant. I can help you with tasks like summarizing rooms, suggesting next steps, and rewriting messages. I also learn from our conversations."
        }
    else:
        return chat_with_ai(db, prompt, user_id)

def chat_with_ai(db: Session, prompt: str, user_id: int):
    """Handles direct chat with the AI, now with proactive learning."""
    add_to_chat_history(user_id, f"User: {prompt}")

    topic = prompt.strip('?').strip()
    knowledge = get_knowledge("general_knowledge", topic)
    
    if knowledge:
        response = knowledge
    else:
        # Proactively learn about the topic
        learning_response = learn_from_public_sources(topic)
        new_knowledge = get_knowledge("general_knowledge", topic)
        if new_knowledge:
            response = new_knowledge
        else:
            response = f"I tried to learn about '{topic}', but I couldn't find any information. I will keep trying and let you know if I find anything."

    add_to_chat_history(user_id, f"Kenyan: {response}")
    return {"response": response}

def summarize(db: Session, text: str, user_id: int, context: dict = None):
    """
    Summarizes a given text using ML models, with context if available.
    """
    if summarizer:
        try:
            # Use ML model for summarization
            summary_result = summarizer(text, max_length=150, min_length=30, do_sample=False)
            summary = summary_result[0]['summary_text']
            return {"response": f"Summary: {summary}"}
        except Exception as e:
            print(f"ML summarization failed: {e}")
    
    # Fallback to basic summarization
    sentences = text.split('.')
    key_sentences = [s for s in sentences if "decision" in s.lower() or "action" in s.lower() or "proposal" in s.lower()]
    if not key_sentences:
        key_sentences = [s for s in sentences if any(char.isdigit() for char in s)]
    if not key_sentences:
        key_sentences = sentences[:2]
    summary = ". ".join(key_sentences)
    return {"response": f"Summary: {summary}"}

def suggest_next_steps(db: Session, text: str, user_id: int, context: dict = None):
    """
    Suggests next steps based on a given text using ML models, with context if available.
    """
    if generator:
        try:
            # Use ML model to generate suggestions
            prompt = f"Based on this text, suggest 3 practical next steps: {text[:500]}"
            suggestions_result = generator(prompt, max_length=200, num_return_sequences=1, temperature=0.7)
            generated_text = suggestions_result[0]['generated_text']
            
            # Extract suggestions from generated text
            suggestions = []
            lines = generated_text.split('\n')
            for line in lines:
                if line.strip() and (line.startswith('1.') or line.startswith('2.') or line.startswith('3.') or 'step' in line.lower()):
                    suggestions.append(line.strip())
            
            if suggestions:
                return {"response": "Here are some AI-generated next steps:", "suggestions": suggestions[:3]}
        except Exception as e:
            print(f"ML suggestion generation failed: {e}")
    
    # Fallback to basic NLP-based suggestions
    words = text.lower().replace('.', '').replace(',', '').split()
    nouns = [word for word in words if word.endswith('tion') or word.endswith('ment') or word.endswith('or') or word.endswith('er')]
    verbs = [word for word in words if word.endswith('ing') or word.endswith('ize') or word.endswith('ate')]
    entities = list(set(nouns))
    actions = list(set(verbs))
    questions = [sentence for sentence in text.split('.') if '?' in sentence]
    suggestions = []

    if entities and actions:
        suggestions.append(f"Consider creating a project around '{entities[0]}' to further explore the '{actions[0]}' aspect.")
    elif entities:
        suggestions.append(f"You mentioned '{entities[0]}'. Perhaps you could start a discussion about it?")
    elif actions:
        suggestions.append(f"You seem to be focused on '{actions[0]}'. Have you thought about creating a task list for it?")

    if questions:
        suggestions.append("It looks like there are some open questions. You could try to answer them in a new post or a Q&A session.")

    if not suggestions:
        suggestions.append("Draft a proposal for a new initiative based on the discussion.")
        
    if entities:
        similar_users = crud_user.search(db, query=" ".join(entities))
        if similar_users:
            suggestions.append(f"Collaborate with {similar_users[0].username} on a project related to {', '.join(entities)}.")

    if len(entities) > 1:
        suggestions.append(f"Connect with other users who are passionate about {entities[0]} and {entities[1]}.")

    return {"response": "Here are some suggested next steps:", "suggestions": suggestions}

def assist_in_room(db: Session, prompt: str, user_profile, room_id: int):
    """
    Handles AI assistance within a room context.
    """
    room_details = crud_room.get(db, id=room_id)
    if not room_details:
        return {"response": "I'm sorry, I couldn't find the details for this room."}

    if "summarize" in prompt:
        voice_data = "mock_voice_data"
        transcript = transcribe_voice(voice_data)
        return summarize(db, transcript, user_profile.id, context={"type": "room", "id": room_id})

    elif "suggest next steps" in prompt:
        voice_data = "mock_voice_data"
        transcript = transcribe_voice(voice_data)
        return suggest_next_steps(db, transcript, user_profile.id, context={"type": "room", "id": room_id})

    else:
        add_to_chat_history(user_profile.id, f"User: {prompt}")
        history = get_chat_history(user_profile.id)
        response = f"I'm Kenyan, and I'm here to help. You said: '{prompt}'. In this room, you can ask me to 'summarize' or 'suggest next steps'."
        add_to_chat_history(user_profile.id, f"AI: {response}")
        return {"response": response}

def rewrite_text(db: Session, text: str, user_id: int, context: dict = None):
    """
    Rewrites a given text based on a specified tone.
    """
    tone = context.get("tone", "respectful") if context else "respectful"
    
    # Use rule-based rewriting for now
    if tone == "formal":
        rewritten_text = text.capitalize().replace(" i ", " I ")
    elif tone == "friendly":
        rewritten_text = text.lower() + " :) "
    elif tone == "concise":
        rewritten_text = " ".join(text.split()[:5]) + "..."
    else: # respectful
        rewritten_text = f"I understand your perspective, and I'd like to add that {text}"

    return {"response": rewritten_text, "rewritten_text": rewritten_text}

    return {"response": rewritten_text, "rewritten_text": rewritten_text}


# Additional AI service functions for the extended API

def generate_response(prompt: str, conversation_history: list = None):
    """Generate a natural language response to a prompt."""
    return f"Response to: {prompt[:50]}..."

def generate_content(prompt: str, mode: str):
    """Generate, rewrite, or summarize content."""
    if mode == "generate":
        return f"Generated content based on: {prompt[:50]}..."
    elif mode == "rewrite":
        return f"Rewritten version of: {prompt[:50]}..."
    elif mode == "summarize":
        return f"Summary of: {prompt[:50]}..."
    return "Content processed."

def assist_with_code(code: str, language: str, task: str):
    """Provide code assistance."""
    tasks = {
        "explain": f"This {language} code does the following...",
        "debug": f"Potential issues in this {language} code...",
        "optimize": f"Optimized version of this {language} code...",
        "generate": f"Generated {language} code for: {code[:50]}..."
    }
    return tasks.get(task, f"Code assistance for {language}")

def translate_text(text: str, target_language: str):
    """Translate text to target language."""
    return f"Translation to {target_language}: {text[:50]}..."

def solve_problem(problem: str):
    """Solve a problem using reasoning."""
    return f"Solution to '{problem[:50]}...': Step-by-step approach..."

def web_browse(query: str):
    """Browse the web for information."""
    return f"Web search results for: {query[:50]}..."

def analyze_image(image_path: str, prompt: str):
    """Analyze an image."""
    return f"Image analysis for: {prompt[:50]}..."

def generate_image(prompt: str):
    """Generate an image based on prompt."""
    return f"Generated image for: {prompt[:50]}... [Image placeholder]"

def analyze_data(file_path: str, analysis_prompt: str):
    """Analyze data from a file."""
    return f"Data analysis: {analysis_prompt[:50]}..."

def voice_conversation(audio_bytes: bytes):
    """Handle voice conversation."""
    return "Voice transcription and response..."

def run_agent(task: str, parameters: dict = None):
    """Run an AI agent for multi-step tasks."""
    return f"Agent executing task: {task[:50]}..."

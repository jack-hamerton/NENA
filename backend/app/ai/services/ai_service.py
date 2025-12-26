import random
from sqlalchemy.orm import Session
from app.crud.user import user as crud_user
from app.crud.room import room as crud_room
from app.ai.services.transcription import transcribe_voice
from app.ai.services.chat_memory import get_chat_history, add_to_chat_history
from app.ai.prompts import REWRITE_PROMPTS

def assist_user(db: Session, prompt: str, user_id: int, context: dict = None):
    """
    Processes a user's prompt, contextualizes it, and returns an action or a response.
    """
    prompt = prompt.lower().strip()
    user_profile = crud_user.get(db, id=user_id)

    if context and context.get("type") == "room":
        room_id = context.get("id")
        return assist_in_room(db, prompt, user_profile, room_id)
    
    if context and context.get("type") == "rewrite":
        return rewrite_text(db, prompt, user_id, context)

    if context and context.get("type") == "summarize":
        return summarize(db, prompt, user_id, context)

    if context and context.get("type") == "suggest_next_steps":
        return suggest_next_steps(db, prompt, user_id, context)

    # This is a fallback for generic queries
    if "help" in prompt:
        return {
            "response": "I can help you with tasks like summarizing rooms, suggesting next steps, connecting with collaborators, and rewriting messages for a different tone."
        }
    else:
        return chat_with_ai(db, prompt, user_id)

def chat_with_ai(db: Session, prompt: str, user_id: int):
    """Handles direct chat with the AI in the user's personal space."""
    add_to_chat_history(user_id, f"User: {prompt}")
    history = get_chat_history(user_id)

    # In a real application, you would use a language model to generate a response
    # based on the chat history. For now, we will provide a more dynamic response.
    if len(history) > 2:
        response = f"I see you mentioned '{history[-3]}'. Can you tell me more about that?"
    else:
        response = f"You said: '{prompt}'. I'm still a simple AI, but I'm learning. What else is on your mind?"

    add_to_chat_history(user_id, f"AI: {response}")
    return {"response": response}

def summarize(db: Session, text: str, user_id: int, context: dict = None):
    """
    Summarizes a given text, with context if available.
    """
    prompt = f"Please summarize the following text in a way that is clear and concise for a busy community organizer. Highlight the key decisions and action items. The text to summarize is: {text}"
    # In a real application, you would send this prompt to a language model.
    # For now, we will extract key sentences.
    sentences = text.split('.')
    key_sentences = [s for s in sentences if "decision" in s.lower() or "action" in s.lower() or "proposal" in s.lower()]
    if not key_sentences:
        # If no keywords are found, we'll try to find sentences with numbers, which might indicate data or stats.
        key_sentences = [s for s in sentences if any(char.isdigit() for char in s)]
    if not key_sentences:
        key_sentences = sentences[:2] # return first two sentences if no keywords are found.
    summary = ". ".join(key_sentences)
    return {"response": summary}


def suggest_next_steps(db: Session, text: str, user_id: int, context: dict = None):
    """
    Suggests next steps based on a given text, with context if available.
    This is a more advanced version that simulates NLP to extract entities and actions.
    """
    
    # Simulate entity extraction (get all nouns)
    words = text.lower().replace('.', '').replace(',', '').split()
    # A simple way to identify nouns for simulation. In a real app, use a library like NLTK or spaCy.
    nouns = [word for word in words if word.endswith('tion') or word.endswith('ment') or word.endswith('or') or word.endswith('er')]
    # A simple way to identify verbs (actions)
    verbs = [word for word in words if word.endswith('ing') or word.endswith('ize') or word.endswith('ate')]
    
    entities = list(set(nouns))
    actions = list(set(verbs))
    
    # Identify questions
    questions = [sentence for sentence in text.split('.') if '?' in sentence]

    suggestions = []

    # Suggestion based on entities and actions
    if entities and actions:
        suggestions.append(f"Consider creating a project around '{entities[0]}' to further explore the '{actions[0]}' aspect.")
    elif entities:
        suggestions.append(f"You mentioned '{entities[0]}'. Perhaps you could start a discussion about it?")
    elif actions:
        suggestions.append(f"You seem to be focused on '{actions[0]}'. Have you thought about creating a task list for it?")

    # Suggestion based on questions
    if questions:
        suggestions.append("It looks like there are some open questions. You could try to answer them in a new post or a Q&A session.")

    # Generic suggestions
    if not suggestions:
        suggestions.append("Draft a proposal for a new initiative based on the discussion.")
        
    # Find other users with similar interests based on extracted entities
    if entities:
        similar_users = crud_user.search(db, query=" ".join(entities))
        if similar_users:
            suggestions.append(f"Collaborate with {similar_users[0].username} on a project related to {', '.join(entities)}.")

    # Add a suggestion to connect with others who have similar interests.
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
        # In a real app, you'd get the room's voice data.
        # For now, we'll use a mock voice data string.
        voice_data = "mock_voice_data"
        transcript = transcribe_voice(voice_data)
        return summarize(db, transcript, user_profile.id, context={"type": "room", "id": room_id})

    elif "suggest next steps" in prompt:
        voice_data = "mock_voice_data"
        transcript = transcribe_voice(voice_data)
        return suggest_next_steps(db, transcript, user_profile.id, context={"type": "room", "id": room_id})

    else:
        # If the user's prompt is not a specific command, treat it as a chat message.
        add_to_chat_history(user_profile.id, f"User: {prompt}")
        history = get_chat_history(user_profile.id)
        response = f"I'm listening. You said: '{prompt}'. How can I help you in this room? You can ask me to 'summarize' or 'suggest next steps'."
        add_to_chat_history(user_profile.id, f"AI: {response}")
        return {"response": response}

def rewrite_text(db: Session, text: str, user_id: int, context: dict = None):
    """
    Rewrites a given text based on a specified tone.
    """
    tone = context.get("tone", "respectful")
    prompt = REWRITE_PROMPTS.get(tone, REWRITE_PROMPTS["respectful"]) + f' "{text}'

    # In a real application, you would send this prompt to a language model.
    # For now, we'll simulate the rewriting process.
    if tone == "formal":
        rewritten_text = text.capitalize().replace(" i ", " I ") # A very basic formalizer
    elif tone == "friendly":
        rewritten_text = text.lower() + " :) "
    elif tone == "concise":
        rewritten_text = " ".join(text.split()[:5]) + "..." # A very basic shortener
    else: # respectful
        rewritten_text = f"I understand your perspective, and I'd like to add that {text}"

    return {"response": rewritten_text, "rewritten_text": rewritten_text}

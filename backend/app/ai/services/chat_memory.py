from collections import deque

# In-memory store for chat history. In a production environment, you would use a
# more persistent storage solution like a database or a cache.
chat_histories = {}

def get_chat_history(user_id: int):
    """Retrieves the chat history for a given user."""
    if user_id not in chat_histories:
        chat_histories[user_id] = deque(maxlen=10)  # Store the last 10 messages
    return chat_histories[user_id]

def add_to_chat_history(user_id: int, message: str):
    """Adds a message to the user's chat history."""
    history = get_chat_history(user_id)
    history.append(message)

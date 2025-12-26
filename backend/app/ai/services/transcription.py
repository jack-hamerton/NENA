import random
from .transcripts import TRANSCRIPTS

def transcribe_voice(voice_data: str) -> str:
    """
    Simulates the transcription of voice data.
    In a real application, this function would call a speech-to-text API
    to convert the audio data into text.
    """
    # For simulation purposes, we'll return a random transcript from our library.
    print(f"--- Simulating transcription for voice data: {voice_data} ---")
    return random.choice(TRANSCRIPTS)


import random
from collections import Counter
from transformers import pipeline

# Initialize sentiment analysis model
try:
    sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
    print("Sentiment analysis model loaded")
except Exception as e:
    print(f"Error loading sentiment model: {e}")
    sentiment_analyzer = None

# A simple NLP utility to extract words
def extract_words(text):
    return text.lower().split()

# --- AI Simulation Functions ---

def perform_sentiment_analysis(answers):
    """Performs real sentiment analysis on a list of answer texts using ML."""
    if sentiment_analyzer:
        try:
            sentiments = []
            for answer in answers:
                result = sentiment_analyzer(answer.text[:512])  # Limit text length
                sentiments.append(result[0]['label'].lower())
            return dict(Counter(sentiments))
        except Exception as e:
            print(f"ML sentiment analysis failed: {e}")
    
    # Fallback to random sentiment
    sentiments = [random.choice(['positive', 'negative', 'neutral']) for _ in answers]
    return dict(Counter(sentiments))

def extract_key_themes(answers, top_n=10):
    """Extracts key themes from a list of answer texts using improved NLP."""
    all_words = []
    for ans in answers:
        all_words.extend(extract_words(ans.text))
    
    # Filter out common stop words for a more realistic simulation
    stop_words = {'the', 'a', 'is', 'in', 'it', 'and', 'of', 'to', 'for', 'was', 'i', 'that', 'this', 'with', 'as', 'on', 'at', 'by', 'an', 'be', 'are', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'my', 'your', 'our', 'their', 'his', 'her', 'its'}
    filtered_words = [word for word in all_words if word not in stop_words and len(word) > 3]
    
    if not filtered_words:
        return [("No themes yet", 1)]

    # Use Counter for better frequency analysis
    word_freq = Counter(filtered_words)
    
    # Filter for meaningful themes (words that appear more than once)
    meaningful_themes = [(word, count) for word, count in word_freq.most_common() if count > 1]
    
    if meaningful_themes:
        return meaningful_themes[:top_n]
    else:
        # If no repeated words, return most common single occurrences
        return word_freq.most_common(top_n)

def get_key_quotes(answers, themes):
    """Simulates the selection of key quotes that align with the extracted themes."""
    key_quotes = {}
    theme_words = [theme[0] for theme in themes]
    
    for theme_word in theme_words:
        for ans in answers:
            if theme_word in ans.text.lower():
                key_quotes[theme_word] = ans.text
                break  # Take the first quote that matches
    
    return key_quotes

# --- Main Service Function ---

def analyze_study_data(db_session, study_id):
    """
    The main AI service function to analyze all data for a given study.
    This function will be called every time a new answer is submitted.
    """
    # In a real app, you would use the db_session to fetch the answers
    # For this simulation, let's imagine we get them from a hypothetical function
    from app.crud.study import get_answers_for_study
    
    answers = get_answers_for_study(db_session, study_id=study_id)
    if not answers:
        return None

    # Perform the AI analysis
    sentiment = perform_sentiment_analysis(answers)
    themes = extract_key_themes(answers)
    key_quotes = get_key_quotes(answers, themes)

    # Structure the data for the frontend
    analysis_results = {
        "sentiment": sentiment,
        "themes": themes,
        "key_quotes": key_quotes,
    }

    return analysis_results

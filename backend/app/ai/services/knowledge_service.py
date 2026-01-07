
from pathlib import Path
import json
import random

KNOWLEDGE_BASE_DIR = Path("backend/app/ai/knowledge_base")

def get_knowledge(domain: str, topic: str) -> str:
    """
    Retrieves knowledge from the knowledge base.
    """
    domain_path = KNOWLEDGE_BASE_DIR / domain
    if not domain_path.exists():
        return None

    topic_file = domain_path / f"{topic.replace(' ', '_').lower()}.json"
    if not topic_file.exists():
        return None

    with open(topic_file, "r") as f:
        return json.load(f).get("content")

def add_knowledge(domain: str, topic: str, content: str):
    """
    Adds new knowledge to the knowledge base.
    """
    domain_path = KNOWLEDGE_BASE_DIR / domain
    domain_path.mkdir(parents=True, exist_ok=True)

    topic_file = domain_path / f"{topic.replace(' ', '_').lower()}.json"
    with open(topic_file, "w") as f:
        json.dump({"content": content}, f, indent=2)

def learn_from_public_sources(topic: str):
    """
    Simulates learning from public sources, including the internet and other AIs.
    """
    # Simulate gathering data from various sources
    simulated_internet_summary = f"After analyzing various online articles and forums, the consensus on {topic} is that it is a multifaceted issue with significant social impact."
    simulated_ai_insight = f"Leading AI models suggest that the key drivers of {topic} include economic factors, policy changes, and technological advancements."
    simulated_academic_review = f"A review of academic papers on {topic} indicates a growing body of research, though more longitudinal studies are needed."

    # Combine the insights into a comprehensive summary
    combined_content = f"{simulated_internet_summary} {simulated_ai_insight} {simulated_academic_review}"

    add_knowledge("general_knowledge", topic, combined_content)
    return f'I have researched "{topic}" using a variety of sources and added a summary to my knowledge base.'

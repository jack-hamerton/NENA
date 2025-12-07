
from pydantic import BaseSettings, EmailStr
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nena"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "a_very_secret_key"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # One week

    # Database
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "nena")
    SQLALCHEMY_DATABASE_URI: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"

    # SMTP for emails
    MAIL_USERNAME: EmailStr = "your-email@example.com"
    MAIL_PASSWORD: str = "your-email-password"
    MAIL_FROM: EmailStr = "noreply@example.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.example.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]  # For development, be more specific in production

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

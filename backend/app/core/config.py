
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path

# Get the directory of the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=BASE_DIR / ".env",
        extra="ignore"  # Allow extra fields without validation
    )

    PROJECT_NAME: str = "Nena"
    API_V1_STR: str = "/api/v1"

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "nena_user"
    POSTGRES_PASSWORD: str = "nena_password"
    POSTGRES_DB: str = "nena_db"
    DATABASE_URL: str = "postgresql://nena_user:nena_password@localhost:5432/nena_db"

    # Security
    SECRET_KEY: str = "nena-backend-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 30
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 24

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://localhost:6379"

    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"

    # S3
    S3_ENDPOINT_URL: str = "http://localhost:9000"
    S3_ACCESS_KEY_ID: str = "minioadmin"
    S3_SECRET_ACCESS_KEY: str = "minioadmin"
    S3_BUCKET_NAME: str = "nena-bucket"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5000", "http://localhost:8000"]

settings = Settings()

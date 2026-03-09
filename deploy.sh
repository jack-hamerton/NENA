#!/bin/bash

# NENA Deployment Script
# This script handles deployment for both development and production environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in development or production
if [ "$1" = "prod" ]; then
    ENVIRONMENT="production"
    COMPOSE_FILE="docker-compose.prod.yml"
    print_status "Deploying to PRODUCTION environment"
else
    ENVIRONMENT="development"
    COMPOSE_FILE="docker-compose.dev.yml"
    print_status "Deploying to DEVELOPMENT environment"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Pull latest changes if in production
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Pulling latest changes from git..."
    git pull origin main
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker compose -f $COMPOSE_FILE down || true

# Build and start services
print_status "Building and starting services..."
if [ "$ENVIRONMENT" = "production" ]; then
    docker compose -f $COMPOSE_FILE up -d --build
else
    docker compose -f $COMPOSE_FILE up -d
fi

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Run database migrations for backend
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Running database migrations..."
    docker compose -f $COMPOSE_FILE exec -T backend python -c "
from app.db.base_class import Base, get_engine
from app.models import *
engine = get_engine()
Base.metadata.create_all(bind=engine)
print('Database migrations completed')
"
fi

# Run health checks
print_status "Running health checks..."

# Backend health check
if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
    print_status "Backend is healthy"
else
    print_warning "Backend health check failed"
fi

# Frontend health check
if [ "$ENVIRONMENT" = "production" ]; then
    FRONTEND_URL="http://localhost"
else
    FRONTEND_URL="http://localhost:3000"
fi

if curl -f $FRONTEND_URL > /dev/null 2>&1; then
    print_status "Frontend is healthy"
else
    print_warning "Frontend health check failed"
fi

# Database health check
if docker compose -f $COMPOSE_FILE exec -T db pg_isready -U nena_user -d nena_db > /dev/null 2>&1; then
    print_status "Database is healthy"
else
    print_warning "Database health check failed"
fi

print_status "Deployment completed!"
print_status "Application is running at:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost:8000"
else
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
fi

# Show logs if requested
if [ "$2" = "logs" ]; then
    print_status "Showing logs (Ctrl+C to exit)..."
    docker compose -f $COMPOSE_FILE logs -f
fi
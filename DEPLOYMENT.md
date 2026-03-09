# NENA Deployment Guide

This guide covers how to deploy the NENA application in both development and production environments.

## Prerequisites

- Docker and Docker Compose installed
- Git
- For production: A VPS with SSH access

## Quick Start

### Development Deployment

```bash
# Clone the repository
git clone https://github.com/yourusername/nena.git
cd nena

# Deploy in development mode
./deploy.sh dev

# Or simply
./deploy.sh
```

### Production Deployment

```bash
# On your production server
git clone https://github.com/yourusername/nena.git
cd nena

# Create production environment file
cp backend/.env.prod.example backend/.env.prod
# Edit the file with your production settings

# Deploy in production mode
./deploy.sh prod
```

## Environment Configuration

### Development (.env)
```bash
# Database
DATABASE_URL=postgresql://nena_user:nena_password@db:5432/nena_db

# Redis
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=your-development-secret-key

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Production (.env.prod)
```bash
# Database
DATABASE_URL=postgresql://nena_user:nena_password@db:5432/nena_db

# Redis
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=your-production-secret-key-change-this

# CORS
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
```

## Services

The application consists of the following services:

- **Frontend**: React application served by Nginx (Port 80/3000)
- **Backend**: FastAPI application served by Gunicorn (Port 8000)
- **Database**: PostgreSQL database (Port 5432)
- **Redis**: Caching and session storage (Port 6379)
- **Nginx**: Reverse proxy and load balancer (Production only)

## CI/CD Pipeline

The GitHub Actions pipeline includes:

1. **Backend Testing**: Python linting, testing, and type checking
2. **Frontend Testing**: JavaScript linting, testing, and building
3. **Docker Building**: Build and push container images to GitHub Container Registry
4. **Production Deployment**: Automated deployment to VPS via SSH

### Required Secrets

For the CI/CD pipeline to work, set these secrets in your GitHub repository:

- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USER`: SSH username for your VPS
- `VPS_SSH_KEY`: Private SSH key for authentication

## Manual Deployment

If you prefer manual deployment:

```bash
# Build and start services
docker compose -f docker-compose.prod.yml up -d --build

# Run database migrations
docker compose -f docker-compose.prod.yml exec backend python -c "
from app.db.base_class import Base, get_engine
from app.models import *
engine = get_engine()
Base.metadata.create_all(bind=engine)
"

# Check logs
docker compose -f docker-compose.prod.yml logs -f
```

## Monitoring

### Health Checks

The application includes health checks for all services:

- Backend: `http://localhost:8000/docs`
- Frontend: `http://localhost` (production) or `http://localhost:3000` (development)
- Database: PostgreSQL health check

### Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 80, 8000, 5432, 6379 are available
2. **Database connection**: Check DATABASE_URL in environment files
3. **Build failures**: Ensure all dependencies are properly specified
4. **SSL certificates**: For HTTPS, configure SSL certificates in nginx

### Database Issues

```bash
# Reset database
docker compose down
docker volume rm nena_postgres_data
docker compose up -d db

# Access database directly
docker compose exec db psql -U nena_user -d nena_db
```

## Security Considerations

- Change default passwords in production
- Use strong SECRET_KEY
- Configure SSL/TLS certificates
- Set up firewall rules
- Regularly update Docker images
- Monitor logs for security issues

## Backup and Recovery

```bash
# Backup database
docker compose exec db pg_dump -U nena_user nena_db > backup.sql

# Restore database
docker compose exec -T db psql -U nena_user -d nena_db < backup.sql
```

## Performance Optimization

- Use Redis for caching
- Configure Nginx for static file serving
- Set up database indexes
- Monitor resource usage
- Scale services as needed
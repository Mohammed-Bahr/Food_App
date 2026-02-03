# Express Backend Docker Setup

This repository contains Docker configuration for an Express.js backend application.

## Files Included

- `Dockerfile` - Multi-stage Docker build configuration
- `.dockerignore` - Files to exclude from Docker build context
- `docker-compose.yml` - Docker Compose configuration for easy deployment

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

### Production Mode

```bash
# Build and run the production container
docker-compose up -d app

# View logs
docker-compose logs -f app

# Stop the container
docker-compose down
```

### Development Mode

```bash
# Run with hot reload (development mode)
docker-compose --profile dev up app-dev

# Or run detached
docker-compose --profile dev up -d app-dev
```

## Building the Docker Image

### Build for production
```bash
docker build -t express-backend:latest --target production .
```

### Build for development
```bash
docker build -t express-backend:dev --target dev .
```

## Running the Container

### Run production container
```bash
docker run -d \
  --name express-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  express-backend:latest
```

### Run with environment file
```bash
docker run -d \
  --name express-backend \
  -p 3000:3000 \
  --env-file .env \
  express-backend:latest
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Application
PORT=3000
NODE_ENV=production

# Database (if applicable)
# DATABASE_URL=postgresql://user:password@db:5432/dbname
# MONGO_URI=mongodb://admin:admin@mongo:27017/dbname

# Redis (if applicable)
# REDIS_URL=redis://redis:6379

# JWT
# JWT_SECRET=your-secret-key
# JWT_EXPIRES_IN=7d

# Other configuration
# API_KEY=your-api-key
```

## Docker Compose Services

### Main Services
- `app` - Production Express backend (default)
- `app-dev` - Development Express backend with hot reload

### Optional Services (uncomment in docker-compose.yml)
- `db` - PostgreSQL database
- `mongo` - MongoDB database
- `redis` - Redis cache

## Useful Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f app

# Execute commands in container
docker-compose exec app sh

# Rebuild containers
docker-compose up --build

# Stop and remove containers
docker-compose down

# Stop and remove containers with volumes
docker-compose down -v

# Scale services
docker-compose up -d --scale app=3
```

## Health Check

The Dockerfile includes a health check that pings `/health` endpoint. Ensure your Express app has this endpoint:

```javascript
// In your Express app
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

## Security Notes

1. The production image runs as a non-root user (`expressuser`)
2. Uses Alpine Linux for smaller image size
3. Multi-stage build reduces final image size
4. Only production dependencies are included in the final image

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs app

# Check if port is already in use
netstat -tulpn | grep 3000
```

### Permission issues
```bash
# If you have permission issues, rebuild with correct ownership
docker-compose build --no-cache
```

### Can't connect to database
```bash
# Make sure database service is running
docker-compose ps

# Check network connectivity
docker-compose exec app ping db
```

## Production Deployment

For production, consider:

1. Using environment-specific compose files:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. Using secrets management (Docker Secrets, AWS Secrets Manager, etc.)

3. Setting up proper logging and monitoring

4. Using a reverse proxy (nginx, traefik) for SSL/TLS

5. Implementing proper backup strategies for data volumes

## License

[Your License Here]

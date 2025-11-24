# Deployment Guide

## Overview

Esta guía cubre el despliegue de Nutriabb MVP en diferentes entornos, desde desarrollo local hasta producción.

## Prerequisites

### System Requirements
- **Node.js**: v16 o superior
- **PostgreSQL**: v12 o superior
- **npm**: v7 o superior (incluido con Node.js)
- **Git**: Para clonado del repositorio

### Production Requirements
- **Process Manager**: PM2 (recomendado)
- **Reverse Proxy**: Nginx (recomendado)
- **SSL Certificate**: Let's Encrypt o similar
- **Monitoring**: Logs y métricas de aplicación

## Local Development

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd nutriabb-mvp

# Automated setup
npm run setup

# Start development server
npm run dev
```

### Manual Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Initialize database
npm run db:init

# Run tests
npm test

# Start development server
npm run dev
```

## Production Deployment

### 1. Server Preparation

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (optional)
sudo apt install nginx
```

#### CentOS/RHEL
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE nutriabb_mvp;
CREATE USER nutriabb_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE nutriabb_mvp TO nutriabb_user;
\q
```

### 3. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/nutriabb-mvp
sudo chown $USER:$USER /var/www/nutriabb-mvp

# Clone repository
cd /var/www/nutriabb-mvp
git clone <repository-url> .

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.example .env
# Edit .env with production settings
```

### 4. Environment Configuration

Create production `.env` file:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutriabb_mvp
DB_USER=nutriabb_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=24h

# Bcrypt Configuration
BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

### 5. Database Initialization

```bash
# Initialize database schema
npm run db:init

# Verify setup
npm run db:migrate:status
```

### 6. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'nutriabb-mvp',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 7. Start Application

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command
```

### 8. Nginx Configuration (Optional)

Create `/etc/nginx/sites-available/nutriabb-mvp`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/nutriabb-mvp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nutriabb -u 1001

# Change ownership
RUN chown -R nutriabb:nodejs /usr/src/app
USER nutriabb

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=nutriabb_mvp
      - DB_USER=nutriabb_user
      - DB_PASSWORD=secure_password
      - JWT_SECRET=your_jwt_secret_here
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=nutriabb_mvp
      - POSTGRES_USER=nutriabb_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Build and start
docker-compose up -d

# Initialize database
docker-compose exec app npm run db:init

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Cloud Deployment

### Heroku

1. **Prepare application:**
```bash
# Add Procfile
echo "web: npm start" > Procfile

# Ensure package.json has engines
{
  "engines": {
    "node": "18.x",
    "npm": "8.x"
  }
}
```

2. **Deploy:**
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create nutriabb-mvp

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main

# Initialize database
heroku run npm run db:init
```

### AWS EC2

1. **Launch EC2 instance** (Ubuntu 20.04 LTS)
2. **Configure security groups** (ports 22, 80, 443)
3. **Follow production deployment steps** above
4. **Setup RDS PostgreSQL** (recommended for production)

### DigitalOcean Droplet

1. **Create droplet** (Ubuntu 20.04)
2. **Follow production deployment steps**
3. **Setup managed PostgreSQL** (optional)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `nutriabb_mvp` |
| `DB_USER` | Database user | `nutriabb_user` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `JWT_SECRET` | JWT signing key | `32+ character string` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `BCRYPT_ROUNDS` | Bcrypt rounds | `12` |
| `LOG_LEVEL` | Logging level | `info` |

## Security Checklist

### Pre-deployment
- [ ] Change default JWT_SECRET
- [ ] Use strong database passwords
- [ ] Enable firewall (UFW/iptables)
- [ ] Update system packages
- [ ] Configure fail2ban (optional)

### Post-deployment
- [ ] Setup SSL certificate
- [ ] Configure CORS properly
- [ ] Enable security headers
- [ ] Setup log monitoring
- [ ] Configure backup strategy

## Monitoring and Logging

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs nutriabb-mvp

# Monitor resources
pm2 monit

# Restart application
pm2 restart nutriabb-mvp
```

### Log Files

- **Application logs**: `logs/combined.log`
- **Error logs**: `logs/err.log`
- **Access logs**: Configure via Nginx/Apache

### Health Checks

Create `healthcheck.js`:

```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U nutriabb_user nutriabb_mvp > /backups/nutriabb_$DATE.sql
find /backups -name "nutriabb_*.sql" -mtime +7 -delete
```

### Application Backups

```bash
# Backup application files
tar -czf /backups/app_$DATE.tar.gz /var/www/nutriabb-mvp --exclude=node_modules
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Database connection failed**
   - Check PostgreSQL service status
   - Verify credentials in .env
   - Check firewall settings

3. **PM2 not starting**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

4. **High memory usage**
   - Check for memory leaks
   - Adjust `max_memory_restart` in PM2 config
   - Monitor with `pm2 monit`

### Log Analysis

```bash
# Check application errors
tail -f logs/err.log

# Check system logs
sudo journalctl -u nginx -f
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## Performance Optimization

### Application Level
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Server Level
- Configure Nginx caching
- Enable HTTP/2
- Optimize PostgreSQL settings
- Monitor resource usage

### Database Optimization
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Update table statistics
ANALYZE users;
ANALYZE profiles;
```

## Rollback Strategy

### Application Rollback
```bash
# Using PM2
pm2 stop nutriabb-mvp
git checkout previous-version
npm ci --only=production
pm2 start nutriabb-mvp
```

### Database Rollback
```bash
# Restore from backup
psql -h localhost -U nutriabb_user -d nutriabb_mvp < /backups/nutriabb_backup.sql
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session management (stateless design)
- Database connection pooling
- Shared file storage

### Vertical Scaling
- Increase server resources
- Optimize application performance
- Database performance tuning
- Caching implementation
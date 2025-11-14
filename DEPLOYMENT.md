# Guide de Déploiement - GENZ212 France

Ce guide explique comment déployer l'application GENZ212 France en production.

## 📋 Prérequis

- Serveur avec Node.js 18+
- Base de données PostgreSQL
- Domaine configuré avec SSL/TLS
- (Optionnel) Service de stockage pour les fichiers (AWS S3, etc.)

## 🚀 Options de déploiement

### Option 1: Déploiement traditionnel (VPS)

#### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib

# Installer PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Configurer PostgreSQL

```bash
sudo -u postgres psql

# Dans psql
CREATE DATABASE genz212;
CREATE USER genz212user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE genz212 TO genz212user;
\q
```

#### 3. Cloner et configurer l'application

```bash
# Cloner le repository
git clone <your-repo-url> /var/www/genz212
cd /var/www/genz212

# Installer les dépendances
npm run install:all

# Configurer les variables d'environnement
cp server/.env.example server/.env
nano server/.env
```

Éditer `.env` avec les bonnes valeurs :
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://genz212user:your_password@localhost:5432/genz212"
JWT_SECRET=<générer un secret fort>
CORS_ORIGIN=https://votre-domaine.com
```

#### 4. Build et migration

```bash
# Build le frontend
cd client
npm run build

# Migrer la base de données
cd ../server
npx prisma migrate deploy
```

#### 5. Démarrer avec PM2

```bash
# Depuis la racine
pm2 start server/src/server.js --name "genz212-api"
pm2 save
pm2 startup
```

#### 6. Configurer Nginx

```bash
sudo apt install nginx

# Créer la configuration
sudo nano /etc/nginx/sites-available/genz212
```

Configuration Nginx :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Frontend (build React)
    root /var/www/genz212/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        alias /var/www/genz212/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    client_max_body_size 50M;
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/genz212 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### Option 2: Déploiement Docker

#### 1. Créer Dockerfile pour le backend

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### 2. Créer Dockerfile pour le frontend

```dockerfile
# client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

#### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: genz212
      POSTGRES_USER: genz212user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build: ./server
    environment:
      DATABASE_URL: postgresql://genz212user:${DB_PASSWORD}@postgres:5432/genz212
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
    volumes:
      - ./server/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./client
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

```bash
# Démarrer
docker-compose up -d
```

### Option 3: Plateforme cloud (Heroku, Railway, etc.)

#### Heroku

```bash
# Installer Heroku CLI
npm install -g heroku

# Login
heroku login

# Créer l'app
heroku create genz212-france

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurer les variables
heroku config:set JWT_SECRET=<votre_secret>
heroku config:set NODE_ENV=production

# Déployer
git push heroku main

# Migrer la DB
heroku run npx prisma migrate deploy
```

## 🔧 Configuration de production

### Variables d'environnement importantes

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<connection_string>
JWT_SECRET=<secret_très_fort_et_aléatoire>
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
CORS_ORIGIN=https://votre-domaine.com
```

### Sécurité

1. **Générer un JWT_SECRET fort** :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Configurer les headers de sécurité** (déjà fait avec Helmet)

3. **Rate limiting** : Ajouter express-rate-limit si nécessaire

4. **Backups de la base de données** :
```bash
# Script de backup quotidien
pg_dump genz212 > backup_$(date +%Y%m%d).sql
```

### Optimisations

1. **Compression** : Activée avec le middleware `compression`

2. **Caching** : Configurer le cache Nginx pour les assets statiques

3. **CDN** : Utiliser un CDN pour les uploads (Cloudflare, AWS CloudFront)

4. **Monitoring** : Installer PM2 monitoring ou utiliser des services comme Sentry

## 📊 Monitoring et Logs

### PM2 Monitoring

```bash
pm2 monitor
pm2 logs
pm2 status
```

### Logs Nginx

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🔄 Mises à jour

```bash
# Arrêter l'app
pm2 stop genz212-api

# Récupérer les changements
git pull origin main

# Installer les dépendances
npm run install:all

# Migrer la DB si nécessaire
cd server && npx prisma migrate deploy

# Rebuild le frontend
cd ../client && npm run build

# Redémarrer
pm2 restart genz212-api
```

## 🆘 Dépannage

### Backend ne démarre pas
```bash
pm2 logs genz212-api --lines 100
```

### Problèmes de connexion DB
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Tester la connexion
psql -U genz212user -d genz212 -h localhost
```

### Erreurs Nginx
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## 📝 Checklist de déploiement

- [ ] Serveur configuré (Node.js, PostgreSQL)
- [ ] Variables d'environnement définies
- [ ] Base de données migrée
- [ ] Frontend buildé
- [ ] SSL/TLS configuré
- [ ] Nginx configuré et testé
- [ ] PM2 configuré avec auto-restart
- [ ] Backups automatiques configurés
- [ ] Monitoring en place
- [ ] Tests de sécurité effectués
- [ ] Documentation mise à jour
- [ ] Plan de rollback préparé

## 🔗 Ressources utiles

- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/deployment)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

Pour toute question ou problème, consultez les logs et la documentation officielle des technologies utilisées.

# GENZ212 France - Mémoire vivante & Archives

![GENZ212 France](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Une plateforme participative dédiée à la préservation et au partage de la mémoire collective d'un mouvement social important.

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Contribution](#contribution)
- [License](#license)

## 🎯 À propos

GENZ212 France est une archive vivante permettant aux participants d'un mouvement social de partager leurs témoignages, récits personnels, images, vidéos et tous types de contenus. L'objectif est de construire une mémoire collective durable et accessible.

## ✨ Fonctionnalités

### Authentification & Profils
- ✅ Inscription et connexion sécurisées (email + mot de passe)
- ✅ Profils utilisateurs personnalisables
- ✅ Système de followers/following

### Publications & Contenu
- ✅ Création de témoignages et articles
- ✅ Upload de photos, vidéos, audio
- ✅ Catégorisation par thèmes (Police, Manifestations, Solidarité, etc.)
- ✅ Géolocalisation des événements
- ✅ Tags et hashtags
- ✅ Dates d'événements

### Interactions sociales
- ✅ Commentaires sur les publications
- ✅ Système de likes/réactions
- ✅ Partage de contenus
- ✅ Fil d'actualité social
- ✅ Système de modération (signalement)

### Mémoire Collective
- ✅ Timeline chronologique
- ✅ Carte interactive des événements
- ✅ Organisation par catégories thématiques
- ✅ Recherche avancée (mots-clés, dates, lieux, tags)
- ✅ Filtrage et tri des contenus
- ✅ Export des archives

### Design & UX
- ✅ Interface minimaliste et épurée
- ✅ Design responsive (mobile-first)
- ✅ Navigation intuitive
- ✅ Animations fluides
- ✅ Accessibilité optimisée

## 🛠 Technologies

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool moderne et rapide
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Client HTTP
- **Framer Motion** - Animations
- **React Leaflet** - Cartes interactives
- **date-fns** - Manipulation de dates
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne
- **JWT** - Authentification
- **bcryptjs** - Hashage de mots de passe
- **Multer** - Upload de fichiers
- **Helmet** - Sécurité HTTP
- **Morgan** - Logging

## 📦 Installation

### Prérequis

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd karimmmme
```

2. **Installer les dépendances**
```bash
# Installer toutes les dépendances (root, client, server)
npm run install:all
```

3. **Configuration de la base de données**

Créer une base de données PostgreSQL :
```bash
createdb genz212
```

4. **Configuration des variables d'environnement**

Créer un fichier `.env` dans le dossier `server/` :
```bash
cp server/.env.example server/.env
```

Éditer le fichier `.env` avec vos paramètres :
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/genz212?schema=public"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:3000
```

5. **Initialiser la base de données**
```bash
cd server
npx prisma migrate dev
# ou
npm run db:push
```

6. **Démarrer l'application**

En mode développement (avec hot reload) :
```bash
# Depuis la racine du projet
npm run dev
```

Cela démarre :
- Frontend sur http://localhost:3000
- Backend sur http://localhost:5000

## ⚙️ Configuration

### Variables d'environnement

#### Server (`server/.env`)

| Variable | Description | Défaut |
|----------|-------------|---------|
| PORT | Port du serveur | 5000 |
| NODE_ENV | Environnement | development |
| DATABASE_URL | URL de connexion PostgreSQL | - |
| JWT_SECRET | Clé secrète JWT | - |
| JWT_EXPIRES_IN | Durée de validité du token | 7d |
| MAX_FILE_SIZE | Taille max des fichiers (bytes) | 52428800 |
| UPLOAD_PATH | Chemin des uploads | ./uploads |
| CORS_ORIGIN | Origine CORS autorisée | http://localhost:3000 |

### Base de données

Le schéma Prisma se trouve dans `server/prisma/schema.prisma`. Pour appliquer les migrations :

```bash
cd server
npx prisma migrate dev --name init
```

Pour explorer la base de données graphiquement :
```bash
cd server
npm run db:studio
```

## 🚀 Utilisation

### Développement

```bash
# Démarrer en mode développement
npm run dev

# Démarrer seulement le frontend
npm run dev:client

# Démarrer seulement le backend
npm run dev:server
```

### Production

```bash
# Build le frontend et le backend
npm run build

# Démarrer en production
npm start
```

### Commandes utiles

```bash
# Prisma Studio (GUI pour la DB)
cd server && npm run db:studio

# Générer le client Prisma après modification du schema
cd server && npx prisma generate

# Créer une nouvelle migration
cd server && npx prisma migrate dev --name <nom_migration>
```

## 📁 Structure du projet

```
karimmmme/
├── client/                 # Frontend React
│   ├── public/            # Fichiers statiques
│   ├── src/
│   │   ├── assets/        # Images, styles
│   │   ├── components/    # Composants React
│   │   │   ├── Auth/
│   │   │   ├── Filter/
│   │   │   ├── Layout/
│   │   │   ├── Posts/
│   │   │   └── Search/
│   │   ├── contexts/      # Context API (Auth)
│   │   ├── pages/         # Pages principales
│   │   ├── App.jsx        # Composant racine
│   │   └── main.jsx       # Point d'entrée
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Express
│   ├── prisma/
│   │   └── schema.prisma  # Schéma de base de données
│   ├── src/
│   │   ├── config/        # Configuration (DB)
│   │   ├── controllers/   # Logique métier
│   │   ├── middleware/    # Middleware (auth, upload)
│   │   ├── routes/        # Routes API
│   │   └── server.js      # Point d'entrée
│   ├── uploads/           # Fichiers uploadés
│   │   ├── images/
│   │   ├── videos/
│   │   ├── audio/
│   │   └── documents/
│   └── package.json
│
├── package.json           # Configuration monorepo
└── README.md
```

## 📚 API Documentation

### Authentification

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

#### POST `/api/auth/login`
Connexion
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Récupérer l'utilisateur connecté (nécessite authentification)

### Publications

#### GET `/api/posts`
Récupérer toutes les publications (avec filtres optionnels)
- Query params: `sort`, `search`, `category`, `limit`, `offset`

#### GET `/api/posts/:id`
Récupérer une publication par ID

#### POST `/api/posts`
Créer une nouvelle publication (nécessite authentification)
- Support multipart/form-data pour les fichiers

#### PUT `/api/posts/:id`
Mettre à jour une publication

#### DELETE `/api/posts/:id`
Supprimer une publication

#### POST `/api/posts/:id/like`
Aimer une publication

#### DELETE `/api/posts/:id/like`
Retirer un like

### Commentaires

#### GET `/api/posts/:id/comments`
Récupérer les commentaires d'une publication

#### POST `/api/posts/:id/comments`
Ajouter un commentaire

### Utilisateurs

#### GET `/api/users/:userId`
Récupérer le profil d'un utilisateur

#### PUT `/api/users/profile`
Mettre à jour son profil

#### POST `/api/users/:userId/follow`
Suivre un utilisateur

### Archives

#### GET `/api/archives`
Récupérer les archives pour la mémoire collective

#### GET `/api/archives/export`
Exporter les archives en JSON

#### GET `/api/archives/stats`
Récupérer les statistiques de la plateforme

### Contact

#### POST `/api/contact`
Envoyer un message de contact

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Tokens JWT pour l'authentification
- Protection CSRF
- Headers HTTP sécurisés (Helmet)
- Validation des entrées utilisateur
- Upload de fichiers sécurisé avec filtrage

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

Projet créé pour GENZ212 France

## 🙏 Remerciements

Merci à tous les contributeurs et participants du mouvement social pour leur engagement et leur volonté de préserver la mémoire collective.

---

**Note**: Ce projet est une archive participative dédiée à la mémoire collective. Tous les contenus publiés sont sous la responsabilité de leurs auteurs respectifs.

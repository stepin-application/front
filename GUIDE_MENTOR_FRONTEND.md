# Guide Frontend StepIn - Workflows Utilisateur pour Mentor

## 🎯 Qu'est-ce que le Frontend ?

Le **frontend** est la partie visible de notre application StepIn - tout ce que les utilisateurs voient et avec quoi ils interagissent dans leur navigateur web. C'est l'interface utilisateur complète : pages, boutons, formulaires, navigation, et toute l'expérience visuelle.

**Analogie simple :** Dans une voiture, le frontend c'est le tableau de bord, le volant, les sièges (ce que le conducteur utilise), tandis que le backend c'est le moteur et la mécanique (invisible mais essentiel).

## 🗺️ Workflows des Pages par Type d'Utilisateur

### 1. 🚶 Workflow Visiteur Non-Connecté

**Parcours de découverte :**
```
Page d'accueil (/) 
    ↓
Voir campagnes publiques (/campaigns - vue limitée)
    ↓
Cliquer sur une campagne (/campaigns/[id] - détails limités)
    ↓
Tentative de candidature → Redirection vers inscription
    ↓
Inscription/Connexion (/auth/register ou /auth/login)
```

**Pages accessibles :**
- `/` - Accueil avec présentation plateforme et campagnes mises en avant
- `/campaigns` - Liste des campagnes (titres et entreprises seulement)
- `/campaigns/[id]` - Détails limités d'une campagne (description courte)
- `/auth/register` - Inscription (étudiant/école/entreprise)
- `/auth/login` - Connexion
- `/about` - À propos de StepIn
- `/contact` - Contact et support

**Restrictions volontaires :**
- Pas d'accès aux détails complets des campagnes
- Pas de filtres avancés
- Bouton "Candidater" redirige vers inscription
- Maximum 3 campagnes visibles par page

### 2. 🎓 Workflow Étudiant Connecté

**Parcours principal de candidature :**
```
Connexion → Dashboard étudiant (/students/dashboard)
    ↓
Navigation vers campagnes (/campaigns - vue complète)
    ↓
Filtrage et recherche (localisation, secteur, type)
    ↓
Sélection campagne (/campaigns/[id] - détails complets)
    ↓
Candidature (/campaigns/[id]/apply)
    ↓
Suivi candidatures (/students/applications)
```

**Pages dédiées étudiants :**
- `/students/dashboard` - Tableau de bord avec recommandations et statistiques
- `/students/profile` - Profil étudiant avec CV, portfolio, compétences
- `/students/applications` - Suivi de toutes les candidatures avec statuts
- `/students/notifications` - Alertes nouvelles offres et réponses entreprises
- `/students/documents` - Gestion CV, lettres de motivation, certificats

**Pages campagnes (vue étudiant) :**
- `/campaigns` - Liste complète avec filtres avancés (secteur, localisation, salaire, type contrat)
- `/campaigns/[id]` - Détails complets : description, compétences requises, processus sélection
- `/campaigns/[id]/apply` - Formulaire candidature avec upload CV et lettre motivation
- `/campaigns/[id]/company` - Informations détaillées sur l'entreprise

**Fonctionnalités spécifiques :**
- Filtres avancés : localisation, secteur, niveau requis, type de contrat, fourchette salaire
- Système de favoris pour sauvegarder des campagnes intéressantes
- Recommandations personnalisées basées sur le profil et recherches
- Timeline de progression pour chaque candidature
- Notifications push pour nouvelles offres correspondant au profil

### 3. 🏫 Workflow École

**Parcours de gestion des campagnes :**
```
Connexion → Dashboard école (/schools/dashboard)
    ↓
Création campagne (/campaigns/school/new)
    ↓
Invitation entreprises (/campaigns/school/invitations)
    ↓
Gestion campagnes (/campaigns/school/me)
    ↓
Suivi candidatures étudiants (/campaigns/[id]/participants)
```

**Pages existantes (déjà implémentées) :**
- `/campaigns/school/new` - Création nouvelle campagne de recrutement
- `/campaigns/school/me` - Gestion des campagnes de l'école
- `/campaigns/school/[id]/edit` - Modification d'une campagne existante
- `/campaigns/[id]/participants` - Vue des candidatures reçues pour une campagne

**Pages à adapter/étendre :**
- `/schools/dashboard` - Vue d'ensemble : campagnes actives, statistiques placement, entreprises partenaires
- `/schools/students` - Gestion des profils étudiants de l'établissement
- `/schools/companies` - Réseau d'entreprises partenaires
- `/schools/analytics` - Statistiques de placement par filière et promotion

### 4. 🏢 Workflow Entreprise

**Parcours de participation aux campagnes :**
```
Connexion → Dashboard entreprise (/companies/dashboard)
    ↓
Consultation invitations reçues (/campaigns/company/invitations)
    ↓
Réponse invitation école (/invitation/[token])
    ↓
Ajout d'offres à une campagne existante (/campaigns/company/new?campaignId=xxx)
    ↓
Gestion des offres (/campaigns/company/me)
    ↓
Consultation candidatures (/campaigns/[id]/participants)
```

**Pages existantes (déjà implémentées) :**
- `/campaigns/company/invitations` - Gestion des invitations reçues des écoles
- `/invitation/[token]` - Réponse à une invitation d'école (accepter/refuser)
- `/campaigns/company/new` - Ajout d'offres à une campagne existante (pas création de campagne)
- `/campaigns/company/me` - Gestion des offres de l'entreprise dans les campagnes
- `/campaigns/company/[id]/edit` - Modification d'une offre existante

**Pages à adapter/étendre :**
- `/companies/dashboard` - Vue d'ensemble : invitations reçues, offres actives, candidatures reçues
- `/companies/candidates` - Base de données des candidats intéressants pour futurs besoins
- `/companies/schools` - Réseau d'écoles partenaires et historique collaborations

**Important :** Les entreprises ne créent PAS de campagnes de recrutement. Elles participent aux campagnes créées par les écoles en :
1. Recevant une invitation par email d'une école
2. Acceptant l'invitation via le lien `/invitation/[token]`
3. Ajoutant leurs offres d'emploi/stage à la campagne existante
4. Gérant leurs offres et candidatures reçues

## 🔄 Navigation Adaptative selon le Rôle

### Header/Navigation Dynamique
Le composant `Header.tsx` s'adapte automatiquement selon le type d'utilisateur connecté :

**Visiteur non-connecté :**
- Logo StepIn (lien vers accueil)
- "Campagnes" (vue publique limitée)
- "À propos"
- Boutons "Connexion" et "Inscription"

**Étudiant connecté :**
- Logo StepIn → Dashboard étudiant
- "Campagnes" → Vue complète avec filtres
- "Mes Candidatures" → Suivi applications
- "Profil" → Gestion profil et documents
- Avatar utilisateur avec menu déroulant (paramètres, déconnexion)

**École connectée :**
- Logo StepIn → Dashboard école
- "Mes Campagnes" → Gestion campagnes école
- "Nouvelle Campagne" → Création campagne
- "Étudiants" → Gestion profils étudiants
- "Entreprises" → Réseau partenaires
- Avatar avec menu école

**Entreprise connectée :**
- Logo StepIn → Dashboard entreprise
- "Mes Offres" → Gestion offres dans les campagnes
- "Invitations" → Invitations écoles reçues (priorité)
- "Candidats" → Base de données talents
- Avatar avec menu entreprise

## 📱 Pages Partagées avec Vues Adaptatives

### `/campaigns` - Liste des Campagnes
**Vue Visiteur :** Aperçu limité, 3 campagnes max, pas de filtres, boutons "Voir plus" → inscription
**Vue Étudiant :** Liste complète, filtres avancés, bouton "Candidater", système de favoris
**Vue École :** Leurs campagnes + campagnes partenaires, outils de gestion
**Vue Entreprise :** Campagnes où ils participent, historique des recrutements

### `/campaigns/[id]` - Détails d'une Campagne
**Vue Visiteur :** Informations de base, description courte, "Créer un compte pour candidater"
**Vue Étudiant :** Détails complets, critères, processus sélection, bouton candidature
**Vue École :** Vue administrative si c'est leur campagne, sinon vue partenaire
**Vue Entreprise :** Vue administrative si c'est leur offre, outils de gestion candidatures

## 🎯 Nouvelles Pages à Développer pour Étudiants

### `/students/dashboard` - Dashboard Principal
- Recommandations personnalisées (3-5 campagnes correspondant au profil)
- Statistiques personnelles (candidatures envoyées, taux de réponse)
- Dernières candidatures avec statuts
- Notifications importantes (réponses, nouvelles offres)
- Raccourcis vers actions fréquentes (recherche, profil, candidatures)

### `/students/applications` - Suivi des Candidatures
- Liste de toutes les candidatures avec statuts visuels
- Timeline de progression pour chaque candidature
- Filtres par statut (en attente, vue, entretien, acceptée, refusée)
- Historique des échanges avec les entreprises
- Possibilité de retirer une candidature

### `/campaigns/[id]/apply` - Formulaire de Candidature
- Informations pré-remplies depuis le profil étudiant
- Upload de CV avec prévisualisation
- Zone de texte pour lettre de motivation avec suggestions
- Validation en temps réel des champs requis
- Confirmation avant envoi avec récapitulatif

## 🔒 Système d'Authentification et Autorisations

### Middleware de Protection (`middleware.ts`)
- Vérification automatique des tokens d'authentification
- Redirection vers login si non connecté pour pages protégées
- Vérification des rôles pour accès aux pages spécifiques
- Gestion des sessions expirées

### AuthContext - Gestion Centralisée
- État global de l'utilisateur connecté (rôle, permissions, profil)
- Fonctions de connexion/déconnexion
- Vérification des autorisations pour affichage conditionnel
- Persistance de la session avec refresh automatique

Cette architecture garantit une expérience utilisateur fluide et sécurisée, avec des parcours optimisés pour chaque type d'utilisateur tout en maximisant la réutilisation du code existant.
## 🚀
 Commandes de Développement

### Installation et Lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build

# Lancement en mode production
npm start

# Vérification du code (linting)
npm run lint

# Correction automatique du linting
npm run lint:fix

# Tests (si configurés)
npm test
```

### URLs de Développement

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8080 (services Java Spring Boot)

### Variables d'Environnement

Créer un fichier `.env.local` dans le dossier `front/` :

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080

# Authentification
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Base de données (si nécessaire)
DATABASE_URL=your-database-url
```

## 🔌 API Endpoints - Documentation Complète

### 🔐 Authentification

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "role": "student" | "school" | "company"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "password": "password123"
}
```

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

```http
GET /api/auth/me
Authorization: Bearer {token}
```

### 👤 Gestion des Utilisateurs

```http
GET /api/users/profile
Authorization: Bearer {token}
```

```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nouveau Nom",
  "bio": "Description mise à jour",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

```http
POST /api/users/upload-avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

avatar: [file]
```

### 📋 Campagnes

#### Récupération des Campagnes

```http
GET /api/campaigns
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- location: string
- sector: string
- type: "internship" | "job" | "apprenticeship"
- featured: boolean
```

```http
GET /api/campaigns/featured
# Retourne les campagnes mises en avant pour la page d'accueil
```

```http
GET /api/campaigns/{id}
# Détails complets d'une campagne
```

```http
GET /api/campaigns/search
Query Parameters:
- q: string (terme de recherche)
- location: string
- sector: string
- salary_min: number
- salary_max: number
```

#### Gestion des Campagnes (École/Entreprise)

```http
POST /api/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Stage Développeur Web",
  "description": "Description détaillée...",
  "location": "Paris",
  "sector": "Tech",
  "type": "internship",
  "requirements": ["JavaScript", "React"],
  "salary": 1200,
  "studentDeadline": "2024-03-15T00:00:00Z",
  "companyDeadline": "2024-02-15T00:00:00Z",
  "tags": ["frontend", "junior"]
}
```

```http
PUT /api/campaigns/{id}
Authorization: Bearer {token}
Content-Type: application/json
# Même structure que POST
```

```http
DELETE /api/campaigns/{id}
Authorization: Bearer {token}
```

```http
GET /api/campaigns/me
Authorization: Bearer {token}
# Campagnes créées par l'utilisateur connecté (école/entreprise)
```

### 📝 Candidatures

#### Gestion des Candidatures (Étudiant)

```http
POST /api/campaigns/{id}/apply
Authorization: Bearer {token}
Content-Type: multipart/form-data

coverLetter: string
cv: [file]
additionalDocuments: [files]
```

```http
GET /api/applications/me
Authorization: Bearer {token}
Query Parameters:
- status: "pending" | "viewed" | "interview" | "accepted" | "rejected"
```

```http
PUT /api/applications/{id}/withdraw
Authorization: Bearer {token}
# Retirer une candidature
```

#### Consultation des Candidatures (École/Entreprise)

```http
GET /api/campaigns/{id}/participants
Authorization: Bearer {token}
Query Parameters:
- status: string
- page: number
- limit: number
```

```http
PUT /api/applications/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "viewed" | "interview" | "accepted" | "rejected",
  "feedback": "Commentaire optionnel"
}
```

```http
GET /api/applications/{id}/documents
Authorization: Bearer {token}
# Télécharger les documents d'une candidature
```

### 🏫 Gestion École

```http
GET /api/schools/students
Authorization: Bearer {token}
# Liste des étudiants de l'école
```

```http
POST /api/schools/invite-company
Authorization: Bearer {token}
Content-Type: application/json

{
  "campaignId": "campaign-uuid",
  "companyEmail": "company@example.com",
  "message": "Message d'invitation personnalisé"
}
```

```http
GET /api/schools/analytics
Authorization: Bearer {token}
# Statistiques de placement des étudiants
```

### 🏢 Gestion Entreprise

```http
GET /api/companies/invitations
Authorization: Bearer {token}
# Invitations reçues des écoles
```

```http
PUT /api/invitations/{token}/respond
Content-Type: application/json

{
  "response": "accept" | "decline",
  "message": "Réponse optionnelle"
}
```

```http
GET /api/companies/candidates
Authorization: Bearer {token}
Query Parameters:
- skills: string[]
- location: string
- experience: string
```

### 📊 Statistiques et Analytics

```http
GET /api/analytics/dashboard
Authorization: Bearer {token}
# Données pour le dashboard selon le rôle utilisateur
```

```http
GET /api/analytics/campaigns/{id}
Authorization: Bearer {token}
# Statistiques détaillées d'une campagne
```

### 📁 Gestion des Fichiers

```http
POST /api/upload/document
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [file]
type: "cv" | "cover_letter" | "certificate" | "portfolio"
```

```http
GET /api/files/{id}
Authorization: Bearer {token}
# Télécharger un fichier
```

```http
DELETE /api/files/{id}
Authorization: Bearer {token}
# Supprimer un fichier
```

### 🔔 Notifications

```http
GET /api/notifications
Authorization: Bearer {token}
Query Parameters:
- unread: boolean
- page: number
- limit: number
```

```http
PUT /api/notifications/{id}/read
Authorization: Bearer {token}
```

```http
PUT /api/notifications/mark-all-read
Authorization: Bearer {token}
```

## 🛠️ Structure des Réponses API

### Format Standard de Réponse

```json
{
  "success": true,
  "data": {
    // Données de la réponse
  },
  "message": "Message optionnel",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Format d'Erreur

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description de l'erreur",
    "details": {
      "field": "email",
      "reason": "Format invalide"
    }
  }
}
```

### Codes d'Erreur Courants

- `400` - Bad Request (données invalides)
- `401` - Unauthorized (non authentifié)
- `403` - Forbidden (pas les permissions)
- `404` - Not Found (ressource introuvable)
- `409` - Conflict (ressource déjà existante)
- `422` - Unprocessable Entity (validation échouée)
- `500` - Internal Server Error (erreur serveur)

## 🧪 Tests et Debugging

### Outils de Développement

```bash
# Inspection du build
npm run analyze

# Vérification des types TypeScript
npx tsc --noEmit

# Formatage du code
npm run format

# Vérification de sécurité
npm audit
```

### URLs de Test Utiles

- **Page d'accueil** : http://localhost:3000
- **Connexion** : http://localhost:3000/login
- **Inscription** : http://localhost:3000/register
- **Campagnes** : http://localhost:3000/campaigns
- **Dashboard étudiant** : http://localhost:3000/students/dashboard
- **Dashboard école** : http://localhost:3000/campaigns/school/me
- **Dashboard entreprise** : http://localhost:3000/campaigns/company/me

### Comptes de Test

```
Étudiant :
- Email: student@demo.com
- Password: password

École :
- Email: school@demo.com  
- Password: password

Entreprise :
- Email: company@demo.com
- Password: password
```
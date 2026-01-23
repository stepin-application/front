# StepIn - Frontend

Plateforme de recrutement connectant écoles, entreprises et étudiants.

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
src/
├── app/                      # Pages Next.js (App Router)
│   ├── (auth)/              # Pages authentification
│   ├── campaigns/           # Pages campagnes
│   │   ├── school/          # Campagnes école
│   │   ├── company/         # Offres entreprise
│   │   └── [id]/            # Détail campagne
│   └── invitation/          # Réponse invitations
├── components/              # Composants réutilisables
│   ├── campaigns/           # Composants campagnes
│   ├── sections/            # Sections homepage
│   └── ui/                  # Composants UI de base
├── contexts/                # Contextes React
│   └── AuthContext.tsx      # Authentification
├── lib/                     # Utilitaires
│   ├── api.ts              # Service API
│   └── errorHandler.ts     # Gestion erreurs
└── types/                   # Types TypeScript
    └── campaign.ts          # Types campagnes
```

## 🎯 Fonctionnalités Implémentées

### Pour les Écoles
- ✅ Créer une campagne de recrutement
- ✅ Inviter des entreprises partenaires
- ✅ Voir les entreprises participantes
- ✅ Verrouiller une campagne manuellement
- ✅ Éditer une campagne (si non verrouillée)

### Pour les Entreprises
- ✅ Voir les invitations reçues
- ✅ Accepter/Refuser une invitation
- ✅ Créer des offres de poste
- ✅ Gérer ses offres (éditer, supprimer)
- ✅ Voir ses offres par campagne

## 🔐 Authentification

Le projet utilise un système d'authentification basé sur JWT avec 3 rôles :
- **school** - Administrateur école
- **company** - Utilisateur entreprise
- **student** - Étudiant

## 📡 API Endpoints

Voir `IMPLEMENTATION.md` pour la liste complète des endpoints utilisés.

## 🛠️ Technologies

- **Next.js 15** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Composants accessibles
- **Sonner** - Toast notifications

## 📚 Documentation

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Détails d'implémentation et User Stories
- [Next.js Docs](https://nextjs.org/docs)

## 🔗 Backend

Ce frontend doit être connecté aux services backend :
- `stepin-campaign-service` (Java/Spring Boot)
- `stepin-job-opening-service` (Java/Spring Boot)

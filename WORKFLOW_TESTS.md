# 🧪 Workflow de Tests Complet - StepIn

## 🎯 Objectif
Ce document présente tous les scénarios de test à effectuer pour valider le bon fonctionnement de l'application StepIn selon les différents rôles utilisateur.

## 📋 Checklist de Tests par Workflow

### **🚶 1. Workflow Visiteur Non-Connecté**

#### ✅ Navigation et Découverte
- [ ] **Page d'accueil** : Affichage correct du design moderne
- [ ] **Statistiques** : Affichage des chiffres (500+ étudiants, 50+ écoles, etc.)
- [ ] **Campagnes mises en avant** : Maximum 3 campagnes visibles
- [ ] **Boutons CTA** : "Commencer maintenant" → `/register`
- [ ] **Lien "Découvrir les offres"** → `/campaigns`

#### ✅ Pages Campagnes (Vue Limitée)
- [ ] **Liste campagnes** : Maximum 6 campagnes visibles
- [ ] **Pas de filtres avancés** : Message "Connectez-vous pour plus de filtres"
- [ ] **Détails campagne** : Informations de base seulement
- [ ] **Bouton candidater** : Redirection vers `/register`
- [ ] **Message d'encouragement** : "Créez votre compte pour accéder à toutes les campagnes"

#### ✅ Authentification
- [ ] **Page register** : Design épuré, sélection de rôle
- [ ] **Page login** : Design épuré, champs email/password
- [ ] **Validation formulaires** : Messages d'erreur appropriés
- [ ] **Création compte** : Redirection selon le rôle après inscription

### **🎓 2. Workflow Étudiant Complet**

#### ✅ Inscription et Première Connexion
- [ ] **Inscription étudiant** : Formulaire avec nom, email, password
- [ ] **Première connexion** : Redirection vers `/students/dashboard`
- [ ] **Dashboard étudiant** : Affichage des recommandations
- [ ] **Navigation** : Header adapté avec menu étudiant

#### ✅ Recherche et Filtrage de Campagnes
- [ ] **Page `/campaigns`** : Vue complète avec filtres avancés
- [ ] **Filtres par secteur** : Technologie, Finance, Marketing, etc.
- [ ] **Filtres par localisation** : Paris, Lyon, Remote, etc.
- [ ] **Filtres par type** : Stage, CDI, CDD, Alternance
- [ ] **Recherche textuelle** : Par titre, description, entreprise
- [ ] **Pagination** : Chargement progressif des résultats

#### ✅ Candidature à une Campagne
- [ ] **Détails campagne** : Informations complètes visibles
- [ ] **Bouton "Candidater"** : Accessible et fonctionnel
- [ ] **Page `/campaigns/[id]/apply`** : Formulaire de candidature
- [ ] **Upload CV** : Fonctionnalité d'upload de fichier
- [ ] **Lettre de motivation** : Zone de texte avec suggestions
- [ ] **Validation** : Vérification des champs requis
- [ ] **Soumission** : Confirmation et redirection

#### ✅ Suivi des Candidatures
- [ ] **Page `/students/applications`** : Liste de toutes les candidatures
- [ ] **Statuts visuels** : En attente, Vue, Entretien, Acceptée, Refusée
- [ ] **Timeline** : Progression de chaque candidature
- [ ] **Filtres par statut** : Possibilité de filtrer les candidatures
- [ ] **Retrait candidature** : Possibilité d'annuler une candidature

### **🏫 3. Workflow École Complet**

#### ✅ Inscription et Configuration
- [ ] **Inscription école** : Formulaire avec nom établissement
- [ ] **Première connexion** : Redirection vers `/campaigns/school/me`
- [ ] **Navigation** : Header adapté avec menu école

#### ✅ Création de Campagne
- [ ] **Page `/campaigns/school/new`** : Formulaire de création
- [ ] **Informations campagne** : Titre, description, dates
- [ ] **Paramètres** : Localisation, secteur, type de postes
- [ ] **Critères étudiants** : Niveau requis, compétences
- [ ] **Dates limites** : Candidature étudiants et réponse entreprises
- [ ] **Validation** : Vérification de tous les champs
- [ ] **Création** : Confirmation et redirection vers gestion

#### ✅ Gestion des Campagnes
- [ ] **Page `/campaigns/school/me`** : Liste des campagnes créées
- [ ] **Statuts campagnes** : Brouillon, Active, Fermée, Terminée
- [ ] **Modification** : Accès à `/campaigns/school/[id]/edit`
- [ ] **Statistiques** : Nombre d'entreprises, candidatures reçues
- [ ] **Actions** : Publier, fermer, supprimer campagne

#### ✅ Invitation d'Entreprises
- [ ] **Sélection entreprises** : Liste ou recherche d'entreprises
- [ ] **Message personnalisé** : Zone de texte pour invitation
- [ ] **Envoi invitations** : Confirmation d'envoi par email
- [ ] **Suivi invitations** : Statut (Envoyée, Vue, Acceptée, Refusée)
- [ ] **Relances** : Possibilité de renvoyer une invitation

#### ✅ Gestion des Candidatures
- [ ] **Page `/campaigns/[id]/participants`** : Vue des candidatures
- [ ] **Filtres candidatures** : Par statut, compétences, école
- [ ] **Détails candidat** : CV, lettre de motivation, profil
- [ ] **Actions** : Marquer comme vue, accepter, refuser
- [ ] **Communication** : Envoi de messages aux candidats

### **🏢 4. Workflow Entreprise Complet**

#### ✅ Inscription et Configuration
- [ ] **Inscription entreprise** : Formulaire avec nom entreprise
- [ ] **Première connexion** : Redirection vers `/campaigns/company/me`
- [ ] **Navigation** : Header adapté avec menu entreprise (priorité "Invitations")

#### ✅ Réception et Traitement d'Invitations
- [ ] **Page `/campaigns/company/invitations`** : Liste des invitations reçues
- [ ] **Détails invitation** : École, campagne, message personnalisé
- [ ] **Lien invitation email** : Accès via `/invitation/[token]`
- [ ] **Page réponse** : Accepter/Refuser avec message optionnel
- [ ] **Redirection** : Vers formulaire d'ajout de poste si accepté

#### ✅ Ajout de Postes à une Campagne
- [ ] **Contexte invitation** : URL avec `?invitationId=xxx&campaignId=yyy`
- [ ] **Contexte campagne ouverte** : URL avec `?campaignId=zzz`
- [ ] **Page `/campaigns/company/new`** : Formulaire d'ajout de poste
- [ ] **Informations poste** : Titre, description, type de contrat
- [ ] **Détails** : Durée, dates, localisation, nombre de postes
- [ ] **Prérequis** : Compétences et expériences requises
- [ ] **Avantages** : Salaire, avantages sociaux, etc.
- [ ] **Tags/Domaines** : Catégorisation du poste

#### ✅ Gestion des Offres
- [ ] **Page `/campaigns/company/me`** : Liste des offres dans les campagnes
- [ ] **Statuts offres** : Active, Fermée, Expirée
- [ ] **Modification** : Accès à `/campaigns/company/[id]/edit`
- [ ] **Statistiques** : Nombre de candidatures reçues
- [ ] **Actions** : Modifier, fermer, supprimer offre

#### ✅ Gestion des Candidatures Reçues
- [ ] **Page `/campaigns/[id]/participants`** : Candidatures pour mes offres
- [ ] **Filtres** : Par statut, compétences, expérience
- [ ] **Détails candidat** : CV, lettre, profil étudiant
- [ ] **Actions** : Marquer comme vue, inviter entretien, accepter, refuser
- [ ] **Communication** : Messages aux candidats

### **🔄 5. Workflows Transversaux**

#### ✅ Authentification et Sécurité
- [ ] **Sessions** : Persistance de la connexion
- [ ] **Tokens** : Gestion des tokens d'authentification
- [ ] **Autorisations** : Accès restreint selon les rôles
- [ ] **Redirections** : Automatiques selon le rôle après login
- [ ] **Déconnexion** : Nettoyage de session

#### ✅ Navigation Adaptative
- [ ] **Header visiteur** : Logo, Campagnes, Connexion, Inscription
- [ ] **Header étudiant** : Dashboard, Campagnes, Candidatures, Profil
- [ ] **Header école** : Dashboard, Mes Campagnes, Nouvelle Campagne
- [ ] **Header entreprise** : Dashboard, Mes Offres, Invitations
- [ ] **Responsive** : Adaptation mobile et desktop

#### ✅ Gestion des Erreurs
- [ ] **Erreurs 404** : Pages non trouvées
- [ ] **Erreurs 403** : Accès non autorisé
- [ ] **Erreurs API** : Messages d'erreur appropriés
- [ ] **Validation** : Messages d'erreur de formulaire
- [ ] **Timeouts** : Gestion des timeouts de requête

### **📱 6. Tests avec Comptes de Démonstration**

#### ✅ Compte Étudiant (student@demo.com / password)
- [ ] **Connexion** : Redirection vers dashboard étudiant
- [ ] **Campagnes** : Vue complète avec filtres
- [ ] **Candidature** : Processus complet de candidature
- [ ] **Suivi** : Visualisation des candidatures

#### ✅ Compte École (school@demo.com / password)
- [ ] **Connexion** : Redirection vers gestion campagnes
- [ ] **Création** : Nouvelle campagne complète
- [ ] **Invitations** : Envoi d'invitations aux entreprises
- [ ] **Gestion** : Suivi des candidatures reçues

#### ✅ Compte Entreprise (company@demo.com / password)
- [ ] **Connexion** : Redirection vers mes offres
- [ ] **Invitations** : Visualisation des invitations reçues
- [ ] **Participation** : Ajout de postes aux campagnes
- [ ] **Candidatures** : Gestion des candidatures reçues

## 🚀 Scénarios de Test End-to-End

### **📋 Scénario 1 : Cycle Complet de Recrutement**
1. **École** crée une campagne de recrutement
2. **École** invite des entreprises par email
3. **Entreprise** reçoit l'invitation et l'accepte
4. **Entreprise** ajoute ses postes à la campagne
5. **Étudiant** découvre la campagne et candidate
6. **École/Entreprise** reçoit la candidature et la traite
7. **Étudiant** reçoit une réponse (accepté/refusé)

### **📋 Scénario 2 : Découverte Visiteur → Inscription → Candidature**
1. **Visiteur** découvre l'application via la page d'accueil
2. **Visiteur** explore les campagnes (vue limitée)
3. **Visiteur** s'inscrit comme étudiant
4. **Étudiant** accède aux fonctionnalités complètes
5. **Étudiant** utilise les filtres pour trouver des opportunités
6. **Étudiant** candidate à plusieurs postes
7. **Étudiant** suit l'évolution de ses candidatures

### **📋 Scénario 3 : Gestion Multi-Campagnes École**
1. **École** crée plusieurs campagnes simultanément
2. **École** invite différentes entreprises selon les campagnes
3. **École** gère les réponses et les postes ajoutés
4. **École** suit les candidatures sur toutes les campagnes
5. **École** génère des statistiques de placement

## 🔧 Tests Techniques

### **⚡ Performance**
- [ ] **Temps de chargement** : Pages < 3 secondes
- [ ] **Pagination** : Chargement progressif fluide
- [ ] **Upload fichiers** : Gestion des gros fichiers CV
- [ ] **Recherche** : Réactivité des filtres

### **📱 Responsive Design**
- [ ] **Mobile** : Toutes les pages adaptées
- [ ] **Tablet** : Navigation et formulaires optimisés
- [ ] **Desktop** : Utilisation complète de l'espace

### **🔒 Sécurité**
- [ ] **Injection SQL** : Protection des formulaires
- [ ] **XSS** : Échappement des données utilisateur
- [ ] **CSRF** : Protection des formulaires
- [ ] **Autorisation** : Vérification des permissions

## 📊 Métriques de Succès

### **🎯 Taux de Conversion**
- Visiteur → Inscription : > 15%
- Inscription → Première candidature : > 60%
- Invitation → Participation entreprise : > 40%

### **⏱️ Performance**
- Temps de chargement moyen : < 2 secondes
- Taux d'erreur : < 1%
- Disponibilité : > 99%

### **👥 Engagement**
- Sessions par utilisateur : > 3
- Pages vues par session : > 5
- Temps passé sur l'application : > 10 minutes

Ce workflow de test garantit une validation complète de toutes les fonctionnalités de StepIn ! 🎯
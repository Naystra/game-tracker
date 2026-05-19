#  Game Tracker

Application web fullstack permettant de suivre sa collection de jeux vidéo, ses notes et ses statistiques.

##  Démo en ligne

**Frontend :** [game-tracker-psi.vercel.app](https://game-tracker-psi.vercel.app)  
**Backend :** [game-tracker-backend-e23c.onrender.com](https://game-tracker-backend-e23c.onrender.com)

### Compte de démonstration

Créez un compte directement sur le site, l'inscription est libre et gratuite.

---

##  Fonctionnalités

- **Inscription / Connexion** avec authentification JWT
- **Recherche de jeux** via l'API RAWG
- **Collection personnelle** — ajout, suppression, modification du statut et de la note
- **Statistiques** — graphiques de répartition par statut et note moyenne
- **Profil utilisateur** — avatar, bio, badges, jeux les mieux/moins bien notés
- **Changement de mot de passe** sécurisé
- **Design responsive** — compatible mobile et desktop

---

##  Stack technique

### Frontend
- React 18
- React Router DOM
- Axios
- Chart.js / react-chartjs-2
- react-hot-toast
- DOMPurify
- Vite

### Backend
- Node.js / Express
- MongoDB / Mongoose
- JSON Web Token (JWT)
- bcrypt
- Multer (upload d'avatar)
- express-validator

### Déploiement
- Frontend : Vercel
- Backend : Render
- Base de données : MongoDB Atlas

---

##  Lancer le projet en local

### Prérequis
- Node.js v18+
- Un compte MongoDB Atlas
- Une clé API RAWG ([rawg.io](https://rawg.io/apidocs))

### Backend

```bash
cd game-tracker-backend
npm install
```

Crée un fichier `.env` :
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/game-tracker
JWT_SECRET=tonSecretJWT
```

Lance le serveur :
```bash
npm run dev
```

### Frontend

```bash
cd game-tracker-frontend
npm install
```

Crée un fichier `.env` :
```
VITE_RAWG_API_KEY=ta_clé_rawg
VITE_API_URL=http://localhost:5000
```

Lance l'application :
```bash
npm run dev
```

---

##  Structure du projet

```
game-tracker/
├── game-tracker-frontend/
│   ├── src/
│   │   ├── components/     # Header, Footer, ProtectedRoute
│   │   ├── context/        # UserContext, UserProvider
│   │   ├── pages/          # Home, Login, Register, Search, Library, Stats, Profile, GameDetails
│   │   └── styles/         # Fichiers CSS
│   └── vercel.json
│
└── game-tracker-backend/
    ├── config/             # Multer
    ├── middleware/         # Auth JWT, validation
    ├── models/             # User, Game
    └── routes/             # auth, games, stats, user
```

---

##  Sécurité

- Authentification JWT avec expiration 3 jours
- Mots de passe hashés avec bcrypt
- Routes protégées côté front (ProtectedRoute) et back (middleware protect)
- Validation des données avec express-validator
- Clé API RAWG en variable d'environnement
- Sanitisation HTML avec DOMPurify

---




Projet réalisé dans le cadre du **Titre Professionnel Développeur Web et Web Mobile**.
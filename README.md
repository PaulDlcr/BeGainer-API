# BeGainer API – Propulsez Votre Reprise Sportive avec une IA Coach 🧠🏋️‍♂️

Bienvenue dans le backend de BeGainer, une API RESTful Node.js/Express qui alimente l'application mobile React Native dédiée à la remise en forme.

> **Projet Fullstack React Native + Express + PostgreSQL**
> Backend disponible ici, frontend [dans ce dépôt](https://github.com/BenjaminFalcon27/BeGainer-Frontend)

---

## 🌟 À Propos de BeGainer API

Cette API permet à l'application BeGainer de :

* Gérer les utilisateurs, programmes, exercices, préférences.
* Générer automatiquement des programmes personnalisés avec Claude AI.
* Suivre les séances et enregistrer les sessions complétées.

---

## ✨ Fonctionnalités Clés

* 🔐 Authentification JWT sécurisée
* 🏋️ Gestion des exercices (CRUD complet)
* 🧠 Génération IA avec Claude 3
* 📆 Suivi de programmes de 6 semaines
* 📊 Enregistrement des sessions réalisées
* 📄 Documentation Swagger

---

## 🛠️ Stack Technique

* **Node.js + Express** : API REST rapide
* **PostgreSQL** : Base de données relationnelle
* **Claude AI** : Génération intelligente des programmes
* **Swagger (OpenAPI)** : Docs API interactives
* **Render.com** : Hébergement

---

## 📁 Structure du Projet

```
.
├── controllers/         # Logique métier
├── routes/              # Routes Express
├── middleware/          # Authentification & erreurs
├── services/            # IA & services annexes
├── db.js               # Connexion PostgreSQL
├── swagger/             # Documentation OpenAPI
├── index.js            # Entrée principale
└── README.md
```

---

## 🔐 Routes Principales

### Authentification

* `POST /api/auth/register` : Inscription
* `POST /api/auth/login` : Connexion (retourne JWT)

### Utilisateurs

* `GET /api/users`
* `GET /api/users/:id`
* `PUT /api/users/:id`
* `DELETE /api/users/:id`

### Exercices

* `GET /api/exercises`
* `POST /api/exercises`
* `PUT /api/exercises/:id`
* `DELETE /api/exercises/:id`

### Programmes & Séances

* `POST /api/programs/auto-generate` : Génère un programme via Claude
* `GET /api/sessions/program/:programId` : Séances d’un programme
* `POST /api/session-logs` : Enregistre une session faite
* `GET /api/session-logs/:sessionId/count` : Combien de fois une session a été faite

📚 Swagger Local: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
📚 Swagger Hosted: [https://begainer-api.onrender.com/api-docs/#/](https://begainer-api.onrender.com/api-docs/#/)


---

## ⚙️ Configuration `.env`

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>/sslmode=require
JWT_SECRET=une_cle_secrete
SWAGGER_API_URL_DEV=http://localhost:3000
SWAGGER_API_URL_PROD=https://begainer-api.onrender.com
NODE_ENV=development
CLAUDE_API_KEY=sk-...
CLAUDE_MODEL=claude...
```

---

## 🚀 Démarrer en Local

```bash
git clone https://github.com/PaulDlcr/BeGainer-API.git
cd BeGainer-API
npm install
npm start
```

Puis :

* Swagger dispo sur [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧠 Génération IA via Claude

Claude gère la création de programmes personnalisés basés sur :

* Objectif (`gain muscle`, `lose weight`, `improve health`)
* Durée des séances (en minutes)
* Jours d’entraînement (1 = lundi, ..., 7 = dimanche)
* Équipement disponible (`gym` ou `home_no_equipment`)

Retour : structure JSON avec `session_name`, `day_number`, `exercises[]`

---

## 📌 Roadmap & Améliorations (To-Do)

* ✅ Tests unitaires avec Jest / Supertest
* ✅ Badge "fait" sur les séances
* ✅ Ajout export PDF ou CSV
* 🌟 Suivi hebdo + stats d'évolution

---

## 👥 Auteurs

* Backend : [@PaulDlcr](https://github.com/PaulDlcr)
* Frontend : [@BenjaminFalcon27](https://github.com/BenjaminFalcon27)

---

🏋️️ Reprenez votre forme. Un programme à la fois. Avec BeGainer API ✨

# BeGainer API – Propulsez Votre Reprise Sportive avec une IA Coach 🧠🏋️‍♂️

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23336791.svg?style=flat&logo=postgresql&logoColor=white)](https://dbdiagram.io/d/Begainer-67ea3b144f7afba184c506ed)
[![Render](https://img.shields.io/badge/deploy-render-blue?logo=render)](https://begainer-api.onrender.com)
[![Swagger Docs](https://img.shields.io/badge/API-docs-orange?logo=swagger)](https://begainer-api.onrender.com/api-docs)

Bienvenue dans le backend de BeGainer, une API RESTful Node.js/Express qui alimente l'application mobile React Native dédiée à la remise en forme.

> **Projet Fullstack React Native + Express + PostgreSQL**
---

## 🔗 Accès en Ligne

Pas besoin d’installer le backend en local ! Tout est déployé en ligne et prêt à l’emploi 👇

| Ressource  | Lien |
| ------------- | ------------- |
| 🌐 API en production  | https://begainer-api.onrender.com  |
| 📄 Documentation Swagger  | [https://begainer-api.onrender.com/api-docs](https://begainer-api.onrender.com/api-docs)  |
| 🗂️ Schéma Base de données  | [https://dbdiagram.io/d/Begainer-67ea3b144f7afba184c506ed](https://dbdiagram.io/d/Begainer-67ea3b144f7afba184c506ed) |
| 📱 Frontend mobile (Expo)  | [https://github.com/BenjaminFalcon27/BeGainer-Frontend](https://github.com/BenjaminFalcon27/BeGainer-Frontend) |

 
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

## 🗂️ Schéma de la Base de Données
Le backend repose sur une base PostgreSQL structurée autour des entités suivantes : users, user_preferences, programs, program_sessions, session_exercises, session_logs, exercises.

### 📷 Aperçu du schéma

📌 Voir en ligne : [dbdiagram.io](https://dbdiagram.io/d/Begainer-67ea3b144f7afba184c506ed)

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

## 🔐 Routes API

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
>⚠️ Clé API Claude nécessaire : Rendez-vous sur https://console.anthropic.com, créez un compte, rechargez avec au moins 5 €, et récupérez votre clé depuis >l’interface.

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

## 👥 Auteurs

* [@PaulDlcr](https://github.com/PaulDlcr)
* [@BenjaminFalcon27](https://github.com/BenjaminFalcon27)

---

🏋️️ Reprenez votre forme. Un programme à la fois. Avec BeGainer API ✨

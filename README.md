# Musculation App API

## Description
Cette API permet de gérer des utilisateurs, des exercices, des programmes d'entraînement et l'authentification des utilisateurs dans une application dédiée à la musculation. Elle utilise **Node.js**, **Express**, et une base de données PostgreSQL [schéma visionnable içi](https://dbdiagram.io/d/67ea3b144f7afba184c506ed). L'API permet de créer, lire, mettre à jour et supprimer des utilisateurs, des exercices et des programmes d'entraînement.

## Fonctionnalités
- **Gestion des utilisateurs** : Création de comptes, connexion et gestion des informations des utilisateurs.
- **Gestion des exercices** : Ajout, récupération, modification et suppression des exercices disponibles.
- **Gestion des programmes d'entraînement** : Création, récupération, mise à jour et suppression de programmes d'entraînement personnalisés.
- **Authentification** : Utilisation de JWT (JSON Web Tokens) pour sécuriser les routes.

## Prérequis
- **Node.js** (version 14 ou supérieure)
- **PostgreSQL** : Une base de données PostgreSQL configurée et une table `users`, `exercises`, `programs` dans ta base.
- **Swagger** : Pour la documentation de l'API.

## Installation

### 1. Clone le dépôt
```bash
git clone https://github.com/ton-utilisateur/ton-projet.git
cd ton-projet
```

### 2. Installe les dépendances
```bash
npm install
```

### 3. Configure ton fichier .env
Crée un fichier .env à la racine du projet avec les variables suivantes :
```bash
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/nom_de_la_base
JWT_SECRET=ton_secret_de_jwt
```

- Remplace **username**, **password** et **nom_de_la_base** par les informations de ta base de données PostgreSQL.

- **JWT_SECRET** est utilisé pour signer les tokens JWT.

### 4. Démarre l'application
```bash
npm start
```
Le serveur sera lancé sur http://localhost:5000.


### 5. Accède à la documentation Swagger
L'API est documentée via Swagger. Accède à la documentation en visitant http://localhost:5000/api-docs.

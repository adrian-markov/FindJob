
# Find Job

>  Site de recherche d'emploi (Projet d’école hébergé sur GitHub) 



---

##  Sommaire

* [Aperçu](-aperçu)
* [Fonctionnalités](-fonctionnalités)
* [Installation](-installation)
* [Utilisation](-utilisation)
* [Configuration](-configuration)
* [Scripts](-scripts)
* [Tests](-tests)
* [Contributeurs](-contributeurs)

---

##  Aperçu

Find Job propose une interface simple pour publier des offres, créer un compte, et  gérer les candidatures. Le backend utiliste une API REST avec **FastAPI** (sécurité: hash des mots de passe avec **bcrypt**). Le frontend est en **React + Vite**.

**Resssources principales :** `Python` · `FastAPI` · `bcrypt` · `React` · `Vite`

---

##  Fonctionnalités

* ✅ Création de compte et connexion (hash des mots de passe via **bcrypt**)
* ✅ Persistance MySQL via **SQLAlchemy**
* ✅ Publication et consultation d'offres (interface React)
* ✅ API REST documentée automatiquement (Swagger / Redoc via FastAPI)


---

* **Docs API** : après lancement du backend → [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

##  Installation

### Prérequis

* `git` ≥ 2.x
* `python` ≥ 3.10 · **MySQL** ≥ 8
* `node` ≥ 18 + `npm` ou `pnpm`

###  TL;DR

```bash
git clone <URL_DU_REPO_GITHUB_T-WEB-501-PAR_21>
cd T-WEB-501-PAR_21

# 0) MySQL — créer la base (exemple)
# connectez-vous avec votre client MySQL puis :
# CREATE DATABASE hireup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 1) Backend (FastAPI + SQLAlchemy)
cd backend # (ou le dossier réel du backend)
python -m venv .venv && source .venv/bin/activate # Win: .venv\Scripts\activate
# Installez les dépendances depuis le fichier (nommé `requirements.txt` **ou** `requirement.txt`)
pip install -r requirements.txt || pip install -r requirement.txt || pip install fastapi "uvicorn[standard]" bcrypt python-dotenv sqlalchemy pymysql
cp .env.example .env || true
uvicorn app.main:app --reload --port 8000 &

# 2) Frontend (React + Vite)
cd ../frontend # (ou le dossier réel du frontend)
npm install # ou pnpm install / yarn
cp .env.example .env || true
npm run dev -- --port 5173
```

Ensuite ouvrez **[http://localhost:5173](http://localhost:5173)** (frontend). L’API tourne sur **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.



##  Utilisation

1. Ouvrez le frontend : [http://localhost:5173](http://localhost:5173)
2. Créez un compte et connectez-vous.
3. Naviguez vers les offres, créez/modifiez des entrées.

**Astuce** : l’API expose une doc interactive (Swagger) sur [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) pour tester rapidement.

---

##  Configuration

Variables d’environnement :

| Variable         |                               Par défaut | Description                              |
| ---------------- | ---------------------------------------: | ---------------------------------------- |
| `PORT`           |                                   `8000` | Port du backend FastAPI                  |
| `FRONTEND_PORT`  |                                   `5173` | Port du frontend Vite                    |
| `API_URL`        |                  `http://127.0.0.1:8000` | URL de l’API côté front                  |
| `FRONTEND_URL`   |                  `http://localhost:5173` | URL du front                             |
| `SECRET_KEY`     |                                        — | Clé secrète (JWT / sessions)             |
| `MYSQL_HOST`     |                              `127.0.0.1` | Hôte MySQL                               |
| `MYSQL_PORT`     |                                   `3306` | Port MySQL                               |
| `MYSQL_USER`     |                                   `root` | Utilisateur MySQL                        |
| `MYSQL_PASSWORD` |                                        — | Mot de passe MySQL                       |
| `MYSQL_DB`       |                              `Job_Board` | Nom de la base                           |


**Exemple `.env` backend**

```env
PORT=8000
SECRET_KEY=change-me
BCRYPT_ROUNDS=12
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=changeme
MYSQL_DB=Job_Board
```


---


##  Scripts

### Backend 

```bash
# Démarrer l’API en dev
uvicorn app.main:app --reload --port 8000

# Exécuter les tests (si pytest)
pytest -q
```

### Frontend (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

##  Tests

* **Frontend** : `vitest`/`jest` (optionnel) dans `frontend/tests/`

```bash

# Frontend
npm run test
```





---

##  Contributeurs

* Équipe projet — Johanna Angloma, Valentine Chuon, Adrian Markov
* Technologies : FastAPI, React, Vite, bcrypt.


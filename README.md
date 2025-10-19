
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Projet-Job-Board
Projet pré-Msc Job Board Adrian-Valentine-Johanna

Job Board API (FastAPI)

///Setup////
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # puis éditer les valeurs

/////Base de données////
# importer le dump
mysql -u root -p job_board < job_board.sql

///////Lancer l'API/////
uvicorn app:app --reload --host ${APP_HOST:-127.0.0.1} --port ${APP_PORT:-8000}
Docs Swagger: http://127.0.0.1:8000/docs


<<<<<<< HEAD

=======
>>>>>>> backend

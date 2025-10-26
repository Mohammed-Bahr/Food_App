# Food App (MERN)

Simple recipes application built with the MERN stack. This repository contains two main parts:
- Backend: Node.js + Express + Mongoose (MongoDB)
- Frontend: React (with TailwindCSS + Framer Motion)

Goal: allow users to register/login and create, read, update, delete and filter recipes.

## Repo layout
- Backend/ — Express API, Mongoose models and routes
- Frontend/ — React app (pages, components, context, styles)

## Tech stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React, Tailwind CSS, Framer Motion, lucide-react (icons)
- Dev: nodemon, concurrently (optional)

## Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB instance (local or hosted: Atlas)

## Environment variables
Create a `.env` file for the backend (Backend/.env). Example:
```
MONGO_URI=mongodb://localhost:27017/food_app
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

Frontend may use a .env for client settings (e.g., REACT_APP_API_URL):
```
REACT_APP_API_URL=http://localhost:3000
```

## Setup & run

Backend
1. cd Backend
2. npm install
3. Start:
   - npm start (if defined)
   - or nodemon index.js / node index.js
4. Ensure MongoDB is running and MONGO_URI is correct.

Frontend
1. cd Frontend
2. npm install
3. npm start
4. Open http://localhost:3000 (or the port shown by the React dev server)

Notes: adjust ports if needed. If using both dev servers, consider running them in separate terminals or using a root-level script with `concurrently`.

## API (quick summary)
Base path example: http://localhost:3000 (backend)

Recipes endpoints (see Backend/Recipes/):
- GET /recipes
  - List all recipes
- GET /recipes/filter/favourites
  - List favorite recipes (isLoved: true)
- GET /recipes/:id
  - Get recipe by id
- POST /recipes
  - Create recipe (body: title, description, ingredients, instructions, cookingTime, imageUrl, category)
- PUT /recipes/:id
  - Update recipe by id
- DELETE /recipes/:id
  - Delete recipe by id

User endpoints (used by frontend):
- POST /users/register
  - Register a new user (body fields depend on backend implementation)
- POST /users/login
  - Login and return auth token (implementation-dependent)

Adjust endpoints if your server prefixes routes (e.g., `/api/recipes`).

## Frontend notes
- RegisterPage.jsx demonstrates form handling and submission to `/users/register`.
- The UI uses Tailwind + Framer Motion for animations.

## Troubleshooting
- If 404 on recipe by id, verify:
  - The id is a valid MongoDB ObjectId.
  - The backend is connected to the database.
- If CORS errors, enable CORS in backend (npm package `cors`) and configure allowed origins.

## Contributing
- Fork, create a feature branch, run tests (if any), submit PR.
- Keep commits small and focused.

## License
Add a license file as appropriate (e.g., MIT).


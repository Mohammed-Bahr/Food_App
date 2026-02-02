<img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/63f78360-2aaa-4fc4-b462-8ba9065d56c3" />

<img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/1ce9d873-f061-421f-a475-6d5865076c9a" />

<img width ="1919" height="961" alt="image"  src="images/Screenshot From 2026-02-02 20-12-57.png">

# Food App

A comprehensive Food Recipe Application built with the MERN stack (MongoDB, Express, React, Node.js). This application allows users to browse recipes, manage their profile, and save their favorite dishes.

## System Design & Technology Stack

The application follows a standard Client-Server architecture.

### Frontend

- **Framework**: [React](https://react.dev/) (powered by [Vite](https://vitejs.dev/))
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for utility-first styling.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) and [GSAP](https://gsap.com/) for rich, dynamic interactions.
- **Icons**: [Lucide React](https://lucide.dev/) and MUI Icons.
- **State Management**: React Hooks (implied).
- **Routing**: React Router DOM.

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM.
- **Authentication**: Custom implementation (implied by User routes).
- **Server utility**: `nodemon` for development.

### Database Schema

- **Users**: Stores user profiles (Name, Email, Password, Admin status).
- **Recipes**: Stores recipe details (Title, Ingredients, Instructions, Cooking Time, Categories, Images).
- **Favourites**: Links Users to their saved Recipes.

---

## API Documentation

The backend exposes a RESTful API.

### 🥘 Recipes (`/recipes`)

| Method   | Endpoint                     | Description                                                 |
| :------- | :--------------------------- | :---------------------------------------------------------- |
| `GET`    | `/recipes`                   | Retrieve all recipes.                                       |
| `GET`    | `/recipes/:id`               | Retrieve a specific recipe by ID.                           |
| `POST`   | `/recipes`                   | Create a new recipe.                                        |
| `PUT`    | `/recipes/:id`               | Update an existing recipe.                                  |
| `DELETE` | `/recipes/:id`               | Delete a recipe.                                            |
| `GET`    | `/recipes/filter/favourites` | Get all recipes marked globally as "loved" (internal flag). |

### 👤 Users (`/users`)

| Method   | Endpoint              | Description                |
| :------- | :-------------------- | :------------------------- |
| `POST`   | `/users/register`     | Register a new user.       |
| `POST`   | `/users/login`        | Authenticate a user.       |
| `GET`    | `/users`              | Get all users.             |
| `GET`    | `/users/:id`          | Get user details by ID.    |
| `GET`    | `/users/email/:email` | Get user details by Email. |
| `PUT`    | `/users/:id`          | Update user profile.       |
| `DELETE` | `/users/:id`          | Delete a user account.     |

### ❤️ Favourites (`/favourites`)

| Method   | Endpoint                        | Description                                        |
| :------- | :------------------------------ | :------------------------------------------------- |
| `GET`    | `/favourites/:id`               | Get all favourite recipes for a specific user ID.  |
| `POST`   | `/favourites`                   | Add a recipe to a user's favourites.               |
| `PUT`    | `/favourites/toggle`            | Toggle a recipe in/out of favourites (Add/Remove). |
| `DELETE` | `/favourites/:userId/:recipeId` | Remove a specific recipe from a user's favourites. |

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js**: Ensure Node.js is installed.
- **MongoDB**: Ensure MongoDB is installed and running locally on default port `27017`.

### 1. Backend Setup

Navigate to the Backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install cors dotenv express mongoose nodemon
```

Start the server:

- For development (with auto-restart):
  ```bash
  npm run dev
  ```
- For production/standard start:
  ```bash
  npm start
  ```
  _The server will start at `http://localhost:3000` and connect to the local MongoDB database `Food_App`._

### 2. Frontend Setup

Navigate to the Frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install @emotion/styled @gsap/react @mui/icons-material @mui/styled-engine @tailwindcss/vite dotenv framer-motion gsap lucide-react ogl react react-dom react-router-dom tailwindcss
```

Start the development server:

```bash
npm run dev
```

_Access the application via the URL provided in the terminal (usually `http://localhost:5173`)._






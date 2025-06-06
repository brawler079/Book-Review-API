# Book Review API

A simple RESTful API for a Book Review platform built with Node.js, Express, MongoDB, and JWT authentication.

---

## Features

- User signup and login with JWT
- Add books (authenticated users only)
- Get book list (with pagination and filters)
- View book details with average rating and reviews
- Add, edit, and delete your own reviews
- Search books by title or author

---

## Tech Stack

- Node.js + Express.js
- MongoDB with Mongoose
- JWT based authentication
- bcryptjs for password hashing
- dotenv for environment config

---

## Project Setup

### 1. Clone the repo

```bash
git clone https://github.com/brawler079/Book-Review-API.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

```.env
MONGO_URI=mongodb+srv://anandabhilakshay:anand2711@cluster0.g4bqtlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=JzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva
PORT=3001
```

### 4. Start the server

```bash
npm run dev
```
# 📝 Todo List REST API

A secure and complete Todo List REST API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** using **Mongoose**. This project includes authentication, protected CRUD operations for todo items, and a CRON job that automatically completes overdue todos.

---

## 🚀 Features

- ✅ User Signup & Login with JWT Authentication
- 🔒 Protected Routes for Todos
- 📝 CRUD Operations for Todo Items
- ⏰ Daily CRON Job to Auto-Complete Expired Todos
- 📚 Swagger API Documentation
- 🐳 Docker-based MongoDB Setup

---

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for Password Hashing
- **Scheduling**: node-cron for Scheduled Jobs
- **Documentation**: Swagger for API Documentation

---

## 📦 Installation

### Prerequisites

- Node.js
- Docker (for MongoDB setup)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Akash2811000/todo-list-task.git
cd todo-list-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the environment template and configure your variables:

```bash
cp env.template .env
```

Edit the `.env` file with your configuration:

```env
# Example environment variables
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todolist
JWT_SECRET=your_jwt_secret_key
```

### 4. Set Up MongoDB with Docker

If you don't have MongoDB installed locally, you can use Docker:

```bash
docker compose up -d
```

This will start a MongoDB container in the background.

---

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

The server will start with hot-reload enabled for development.

### Production Mode

```bash
npm run build
npm start
```

---

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/docs
```

### Generate Swagger Documentation

To regenerate the Swagger documentation:

```bash
npm run swagger-autogen
```

---

## 🧪 API Endpoints

### 🔐 Authentication

| Method | Endpoint           | Description                 | Body                                                         |
| ------ | ------------------ | --------------------------- | ------------------------------------------------------------ |
| `POST` | `/api/auth/signup` | Register a new user         | `{ "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/login`  | Login and receive JWT token | `{ "email": "user@example.com", "password": "password123" }` |

### 📝 Todos (Protected Routes)

**Note**: All todo endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: <your_jwt_token>
```

| Method   | Endpoint         | Description                          | Body                                                                                       |
| -------- | ---------------- | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `GET`    | `/api/todos`     | Get all todos for authenticated user | -                                                                                          |
| `POST`   | `/api/todos`     | Create a new todo                    | `{ "title": "Task title", "description": "Task description", "dueDate": "1748628055000" }` |
| `GET`    | `/api/todos/:id` | Get a specific todo by ID            | -                                                                                          |
| `PUT`    | `/api/todos/:id` | Update a specific todo               | `{ "title": "Updated title", "dueDate": "1748628055000" }`                                 |
| `DELETE` | `/api/todos/:id` | Delete a specific todo               | -                                                                                          |

---

## ⏰ CRON Job

A CRON job runs **daily at midnight (00:00)**, automatically marking todos with a past due date as completed. This ensures that overdue tasks are properly managed without manual intervention.

**Testing schedule**: `*/30 * * * * *` (After 30 second for testing purpose)

**Schedule**: `0 0 * * *` (Every day at midnight)

---

## 📁 Project Structure

```
todo-list-task/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── app.ts          # Express app setup
├── docs/               # Swagger documentation
├── .env.template       # Environment template
├── docker-compose.yml  # Docker configuration
├── package.json
└── README.md
```

## 📝 Available Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server with hot-reload |
| `npm run build`           | Build TypeScript to JavaScript           |
| `npm start`               | Start production server                  |
| `npm run swagger-autogen` | Generate Swagger documentation           |

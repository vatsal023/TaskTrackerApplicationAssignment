# 📝 Task Tracker App

A full-stack productivity application that helps users create, manage, filter, and track tasks efficiently. It includes authentication, priority-based sorting, date filters, and a clean UI to simplify task management for individuals and teams.

---

## 🚀 Features

- User registration and login (JWT Authentication)
- Create, update, and delete tasks
- Status & priority filters (To-do, In-progress, Completed / Low, Medium, High)
- Advanced date-based filters (today, this week, overdue)
- Sort tasks by latest or oldest
- Responsive UI built with modern design principles

---

## 🧰 Tech Stack

### **Frontend**
- **React** – Provides a modular, component-based architecture and fast rendering.
- **TailwindCSS** – Enables rapid UI development with utility-first styling.

### **Backend**
- **Node.js** – Efficient, event-driven runtime suitable for scalable APIs.
- **Express.js** – Simplifies routing, middleware handling, and backend logic.

### **Database**
- **MongoDB** – Flexible NoSQL database that easily handles dynamic task structures.

### **Authentication**
- **JSON Web Tokens (JWT)** – Secure, stateless, and efficient authentication mechanism for user sessions.

---

## 📦 Setup Instructions

### 1️ Clone the Repository

git clone https://github.com/vatsal023/TaskTrackerApplicationAssignment.git
cd TaskTrackerApplicationAssignment

### 2 🖥️ Backend Setup (/backend)
cd backend
npm install

Create a .env file:

DB=your_mongodb_connection_string
JWTPRIVATEKEY=your_secret_key
SALT = 11
PORT=4000

Start the Backend Server:
npm start

###3🌐 Frontend Setup (/frontend)
Install Dependencies:

cd frontend
npm install

Start the Frontend:
npm run dev



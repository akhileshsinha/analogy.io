
Analogy.IO
# 🎯 Analogy App

A full-stack web application for creating, browsing, and upvoting **analogies** under various topics — styled in a Netflix-like content browsing experience.  
Built with **React** (frontend), **Node.js + Express** (backend), and **MongoDB** for data storage.

---

## 📸 Features

### 🖥 Frontend
- **Netflix-style UI** for topic browsing and categorization.
- Responsive design for desktop and mobile.
- Topic cards with images, categories, and quick actions.
- Infinite scroll / pagination for browsing content.
- Search and filter by category, purpose, or date.
- Upvote topics and responses in real-time.
- Leaderboards for **Top Users** and **Top Topics**.

### ⚙ Backend
- RESTful API built with **Express**.
- MongoDB integration with Mongoose.
- Swagger UI documentation at `/docs`.
- Separate admin routes for popularity score recomputation.
- Leaderboard endpoints for both topics and users.
- Secure header-based authentication for dev/admin actions.

---

## 🗂 Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React (CRA or Vite), Axios, CSS3 |
| Backend     | Node.js, Express |
| Database    | MongoDB, Mongoose |
| Docs        | Swagger UI |
| Deployment  | Any Node hosting (Heroku, Render, AWS, etc.) |

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME


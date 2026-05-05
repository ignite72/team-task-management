# 🧑‍💼 Team Task Manager

A full-stack web application where Admins can create projects, assign tasks to team members, and track progress with role-based access control.

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| Frontend | https://team-frontend-one.vercel.app |
| Backend API | https://team-task-management-production-bcfe.up.railway.app |

---

## 🚀 Features

- ✅ User Authentication (Signup / Login)
- ✅ Role-Based Access Control (Admin / Member)
- ✅ Task Creation & Assignment (Admin only)
- ✅ Task Status Tracking (Pending / Done)
- ✅ Overdue Task Detection
- ✅ Dashboard with Task Stats
- ✅ Member can mark assigned tasks as Done
- ✅ JWT Authentication for protected routes

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS (Custom Styling)
- Deployed on **Vercel**

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Deployed on **Railway**

---

## 📁 Project Structure

```
team-task-management/ (Backend)
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Task.js
├── server.js
├── package.json
└── .env

team-frontend/ (Frontend)
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── Dashboard.js
│   └── App.js
└── package.json
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /signup | ❌ | Register new user |
| POST | /login | ❌ | Login and get token |
| GET | /profile | ✅ | Get logged in user |
| POST | /tasks | ✅ | Create a task (Admin) |
| GET | /tasks | ✅ | Get tasks created by user |
| GET | /my-tasks | ✅ | Get tasks assigned to user |
| PUT | /tasks/:id | ✅ | Update task status |
| DELETE | /tasks/:id | ✅ | Delete a task (Admin) |

---

## 👥 Roles

| Role | Permissions |
|---|---|
| Admin | Signup, Login, Create Tasks, Assign Tasks, View Created Tasks |
| Member | Signup, Login, View Assigned Tasks, Mark Tasks as Done |

---

## ⚙️ How to Run Locally

### Backend
```bash
git clone https://github.com/ignite72/team-task-management.git
cd team-task-management
npm install
```

Create `.env` file:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
node server.js
```

### Frontend
```bash
git clone https://github.com/ignite72/team-frontend.git
cd team-frontend
npm install
npm start
```

---

## 📦 Environment Variables

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT signing |
| PORT | Server port (default 5000) |

---

## 👨‍💻 Author

**Avinash Kumar**
- GitHub: [@ignite72](https://github.com/ignite72)

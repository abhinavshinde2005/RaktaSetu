# 🩸 RaktaSetu - Setup & Run Guide

## ✨ New Project Structure (Separated Frontend & Backend)

```
RaktaSetu/
├── frontend/         # Frontend (Port 3001)
│   ├── css/          # Styles
│   ├── js/           # Scripts
│   ├── *.html        # Pages
│   └── config.js     # API URL config
├── backend/          # Backend (Port 3000)
│   ├── config/       # Database
│   ├── middleware/   # Auth
│   ├── routes/       # API routes
│   └── server.js     # Backend server
└── .env              # Configuration
```

## 🚀 How to Run

### Step 1: Install All Dependencies
```bash
npm run install-all
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:3000`

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3001`

### Step 4: Open Browser
```
http://localhost:3001/login.html
```

## 🎯 Quick Commands

```bash
# From root directory
npm run backend      # Start backend only
npm run frontend     # Start frontend only
npm run install-all  # Install all dependencies

# From backend directory
npm start           # Start backend
npm run dev         # Start with auto-reload

# From frontend directory
npm run dev         # Start frontend dev server
```

## 🔧 Configuration

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/raktasetu
DB_NAME=raktasetu
SESSION_SECRET=your_secret_key
PORT=3000
```

**Frontend (config.js):**
```js
const API_URL = 'http://localhost:3000';
```

## 📊 Ports

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000`

## ✅ Features

- ✅ Separated frontend and backend
- ✅ CORS enabled for cross-origin requests
- ✅ Independent development servers
- ✅ Proper CSS/JS linking
- ✅ Clean project structure

---

**Made with ❤️ for saving lives**

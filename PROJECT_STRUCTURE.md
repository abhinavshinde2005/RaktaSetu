# 🩸 RaktaSetu - Clean Architecture

## 📁 Project Structure

```
RaktaSetu/
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── test-connection.js # DB test script
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── routes/
│       ├── auth.js            # Login/Register/Logout
│       ├── user.js            # User profile
│       ├── donors.js          # Donor search
│       ├── requests.js        # Blood requests
│       └── camps.js           # Blood camps
├── public/                     # Frontend (HTML/CSS/JS)
│   ├── css/
│   │   └── styles.css         # Custom animations
│   ├── js/
│   │   └── app.js             # Frontend utilities
│   ├── login.html
│   ├── register.html
│   ├── home.html
│   ├── profile.html
│   ├── requests.html
│   └── camps.html
├── .env                        # Environment variables
├── server.js                   # Main server file
└── package.json                # Dependencies
```

## 🚀 Quick Start

### 1. Test Database Connection
```bash
npm run test-db
```

### 2. Start Server
```bash
npm start
```

### 3. Development Mode
```bash
npm run dev
```

## 🔧 Troubleshooting

### If `npm run test-db` fails:

**DNS Resolution Failed:**
- Check internet connection
- Disable VPN/Proxy
- Try: `nslookup cluster0.zvgcogj.mongodb.net`

**MongoDB Connection Failed:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 2-3 minutes for changes to apply

**Still not working:**
- Get new connection string from MongoDB Atlas
- Update MONGODB_URI in .env
- Ensure cluster is not paused

## 📊 Access Application

```
http://localhost:3000/login.html
```

## 🎨 Features

- ✅ Clean separation of concerns
- ✅ Modular route structure
- ✅ GSAP animations
- ✅ Chart.js visualizations
- ✅ Multi-step registration
- ✅ Real-time statistics

## 📝 Environment Variables

```env
MONGODB_URI=your_connection_string
DB_NAME=raktasetu
SESSION_SECRET=your_secret_key
PORT=3000
```

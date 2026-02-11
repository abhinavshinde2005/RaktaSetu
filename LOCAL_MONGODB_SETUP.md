# 🔧 Local MongoDB Setup (Your Network Blocks MongoDB Atlas)

## Problem
Your network/ISP is blocking MongoDB Atlas DNS resolution.

## Solution: Install Local MongoDB

### Step 1: Download MongoDB
https://www.mongodb.com/try/download/community

### Step 2: Install
- Run installer
- Choose "Complete" installation
- Install as Windows Service
- Install MongoDB Compass (optional GUI)

### Step 3: Update .env
```env
MONGODB_URI=mongodb://localhost:27017/raktasetu
DB_NAME=raktasetu
SESSION_SECRET=your_secret_key_here_change_in_production
PORT=3000
```

### Step 4: Start MongoDB Service
```cmd
net start MongoDB
```

### Step 5: Run Application
```bash
npm start
```

## Alternative: Use Mobile Hotspot
1. Connect to mobile hotspot
2. Keep original .env with Atlas connection
3. Run `npm start`

## Verify MongoDB is Running
```cmd
# Check if service is running
sc query MongoDB

# Or connect with MongoDB Compass
mongodb://localhost:27017
```

# ❌ DNS Resolution Failed - Solutions

## 🔍 Problem
Your computer cannot resolve `cluster0.zvgcogj.mongodb.net` to an IP address.

## ✅ Solutions (Try in order)

### Solution 1: Flush DNS Cache
```cmd
ipconfig /flushdns
```

### Solution 2: Change DNS Server
1. Open Control Panel → Network and Internet → Network Connections
2. Right-click your network → Properties
3. Select "Internet Protocol Version 4 (TCP/IPv4)" → Properties
4. Use these DNS servers:
   - Preferred: `8.8.8.8` (Google)
   - Alternate: `8.8.4.4` (Google)
5. Click OK and restart

### Solution 3: Disable VPN/Proxy
- Turn off any VPN
- Disable proxy in Windows settings

### Solution 4: Check Firewall
```cmd
netsh advfirewall set allprofiles state off
```
(Temporarily disable to test)

### Solution 5: Use Standard Connection String
Replace in `.env`:
```
MONGODB_URI=mongodb+srv://abhinavshinde2005_db_user:RgiPtdrwnppi6PeF@cluster0.zvgcogj.mongodb.net/raktasetu?retryWrites=true&w=majority
```

### Solution 6: Use Local MongoDB (Development)
Install MongoDB locally:
```
https://www.mongodb.com/try/download/community
```

Update `.env`:
```
MONGODB_URI=mongodb://localhost:27017
DB_NAME=raktasetu
```

## 🧪 Test After Each Solution
```bash
npm run test-db
```

## 🆘 If Nothing Works
Use MongoDB Compass to test connection:
1. Download: https://www.mongodb.com/products/compass
2. Paste connection string
3. If Compass works but Node.js doesn't, it's a Node.js DNS issue

### Node.js DNS Fix:
```bash
npm install --save-dev node-dns-sd
```

## 📞 Network Admin
If on corporate/school network, contact IT department to whitelist:
- `*.mongodb.net`
- Port: `27017`

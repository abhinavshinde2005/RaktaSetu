# 🩸 RaktaSetu - Production Ready Blood Donation Platform

## 🎯 Project Overview
RaktaSetu is a comprehensive blood donation management system connecting donors with those in need. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🏗️ Architecture

### Frontend (Port 3001)
- **Landing Page**: Blood-themed hero section with statistics
- **Authentication**: Login/Register with multi-step form
- **Dashboard**: Search donors, view statistics, charts
- **Blood Camps**: Create and register for donation camps
- **Requests**: Send/receive blood donation requests
- **Profile**: Manage personal and health information

### Backend (Port 3000)
- **RESTful API**: Express.js with MongoDB
- **Authentication**: Session-based with bcrypt
- **CORS**: Enabled for cross-origin requests
- **Logging**: Comprehensive request/response logging

## 📊 User Flow

```
1. Landing Page (index.html → landing.html)
   ↓
2. Register (Multi-step form with health info)
   ↓
3. Login (Email + Password)
   ↓
4. Home Dashboard
   ├── Search Donors by Blood Type & City
   ├── View Statistics & Charts
   └── Quick Links to Features
   ↓
5. Features
   ├── Blood Camps (Create/Register)
   ├── Requests (Send/Receive/Accept/Reject)
   └── Profile (Update Information)
```

## 🩸 Blood-Themed Features

### Visual Elements
- **Blood Drop Animations**: Floating and pulsing effects
- **Red Gradient Themes**: From #dc2626 to #991b1b
- **Blood Type Cards**: O-, O+, AB+, AB- with compatibility info
- **Pulse Effects**: Heartbeat-like animations on key elements

### User Experience
- **Urgency Levels**: Low, Medium, High, Critical (color-coded)
- **Status Indicators**: Pending, Accepted, Rejected, Completed
- **Real-time Stats**: Donors, Lives Saved, Blood Camps
- **Interactive Charts**: Blood type distribution, monthly donations

## 🔧 Technical Stack

### Frontend
- **UI Framework**: Tailwind CSS (CDN)
- **Animations**: GSAP, Custom CSS animations
- **Charts**: Chart.js
- **Fonts**: Google Fonts (Poppins)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Security**: bcryptjs, express-session
- **CORS**: Enabled for localhost:3001

## 📁 Project Structure

```
RaktaSetu/
├── frontend/                 # Frontend (Port 3001)
│   ├── css/
│   │   └── styles.css       # Blood-themed animations
│   ├── js/
│   │   └── app.js           # Auth utilities, helpers
│   ├── landing.html         # Hero landing page
│   ├── login.html           # Login page
│   ├── register.html        # Multi-step registration
│   ├── home.html            # Dashboard with search
│   ├── camps.html           # Blood camps management
│   ├── requests.html        # Request management
│   ├── profile.html         # User profile
│   ├── config.js            # API URL configuration
│   └── package.json         # http-server
│
├── backend/                  # Backend (Port 3000)
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/
│   │   └── index.js         # Mongoose schemas
│   ├── routes/
│   │   ├── auth.js          # Login/Register/Logout
│   │   ├── user.js          # User profile
│   │   ├── donors.js        # Donor search
│   │   ├── requests.js      # Blood requests
│   │   └── camps.js         # Blood camps
│   ├── server.js            # Express server
│   └── package.json         # Dependencies
│
├── .env                      # Environment variables
├── package.json             # Root scripts
└── README.md                # Setup guide
```

## 🚀 Setup & Run

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### Installation
```bash
# Install all dependencies
npm run install-all

# Or manually
cd frontend && npm install
cd ../backend && npm install
```

### Configuration
**.env file:**
```env
MONGODB_URI=mongodb://localhost:27017/raktasetu
DB_NAME=raktasetu
SESSION_SECRET=your_secret_key_here_change_in_production
PORT=3000
```

**frontend/config.js:**
```js
const API_URL = 'http://localhost:3000';
```

### Running

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/check-auth` - Check authentication status

### User
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

### Donors
- `GET /api/donors?blood_type=A+&city=Delhi` - Search donors

### Requests
- `GET /api/requests/sent` - Get sent requests
- `GET /api/requests/received` - Get received requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request status

### Camps
- `GET /api/camps` - Get all camps
- `GET /api/camps/registered` - Get user's registered camps
- `POST /api/camps` - Create new camp
- `POST /api/camps/:id/register` - Register for camp

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **Session Management**: Secure session cookies
3. **CORS Protection**: Whitelist specific origins
4. **Input Validation**: Pattern matching on forms
5. **Authentication Middleware**: Protected routes

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  blood_type: String,
  date_of_birth: Date,
  gender: String,
  city: String,
  state: String,
  pincode: String,
  address: String,
  weight: Number,
  height: Number,
  is_alcoholic: Boolean,
  is_smoker: Boolean,
  medical_conditions: String,
  last_donation_date: Date,
  willing_to_donate: Boolean,
  emergency_contact: String,
  relation: String,
  created_at: Date
}
```

### Request Collection
```javascript
{
  requester_id: ObjectId,
  requester_name: String,
  donor_id: ObjectId,
  donor_name: String,
  blood_type: String,
  urgency: String (low/medium/high/critical),
  message: String,
  status: String (pending/accepted/rejected/completed),
  created_at: Date
}
```

### Camp Collection
```javascript
{
  name: String,
  organizer: String,
  date: Date,
  time: String,
  venue: String,
  city: String,
  state: String,
  address: String,
  contact_person: String,
  contact_phone: String,
  description: String,
  registered_users: [ObjectId],
  created_at: Date
}
```

## 🎨 Design System

### Colors
- **Primary Red**: #dc2626
- **Dark Red**: #991b1b
- **Pink Accent**: #ec4899
- **Success Green**: #10b981
- **Warning Yellow**: #f59e0b
- **Error Red**: #ef4444

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Animations
- **Float**: 3s ease-in-out infinite
- **Pulse Glow**: 2s ease-in-out infinite
- **Blood Pulse**: 1.5s ease-in-out infinite

## 🐛 Logging & Debugging

### Backend Logs
- ✅ Registration attempts
- ✅ Login attempts
- ✅ All API requests (Method + Path)
- ✅ Database connection status
- ✅ Error messages with stack traces

### Frontend Logs
- Console errors for failed API calls
- Toast notifications for user actions
- Form validation errors

## 🚀 Production Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/raktasetu
SESSION_SECRET=generate_strong_random_secret_here
PORT=3000
NODE_ENV=production
```

### Frontend Build
Update `config.js` with production API URL:
```js
const API_URL = 'https://api.yourdomain.com';
```

### Security Checklist
- [ ] Change SESSION_SECRET
- [ ] Use HTTPS
- [ ] Enable rate limiting
- [ ] Add helmet.js for security headers
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Enable MongoDB authentication
- [ ] Set up proper CORS origins
- [ ] Add request size limits
- [ ] Implement logging service

## 📈 Future Enhancements

1. **Real-time Notifications**: WebSocket for instant alerts
2. **SMS Integration**: Twilio for urgent requests
3. **Email Verification**: Nodemailer for account verification
4. **Blood Bank Integration**: Connect with hospitals
5. **Mobile App**: React Native version
6. **Admin Dashboard**: Manage users and camps
7. **Analytics**: Detailed donation statistics
8. **Geolocation**: Find nearest donors
9. **Appointment Booking**: Schedule donations
10. **Rewards System**: Gamification for donors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - Feel free to use for saving lives!

## 💖 Made with Love

RaktaSetu - Connecting Lives, One Drop at a Time

---

**Emergency Contact**: For critical blood requirements, please contact your nearest blood bank or hospital immediately.

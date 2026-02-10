# 🩸 RaktaSetu - Blood Donation Management System

A comprehensive blood donation management system that connects blood donors with patients in need during emergencies.

## Features

- **User Registration & Authentication**
  - Detailed health information collection
  - Blood type, weight, height, medical conditions
  - Alcohol/smoking habits tracking
  - Emergency contact information

- **Blood Donor Search**
  - Search by blood type and location
  - View donor profiles with contact information
  - Request blood from donors

- **Blood Request Management**
  - Send blood requests with urgency levels
  - Track sent and received requests
  - Accept/reject donation requests

- **Blood Camp Registration**
  - Create and manage blood donation camps
  - Register for upcoming camps
  - View camp details and locations

- **User Profile Management**
  - Update personal information
  - Manage donation preferences
  - Track donation history

## Technology Stack

- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Dependencies**: 
  - MongoDB Node.js Driver
  - Express Session
  - bcryptjs for password hashing
  - dotenv for environment variables

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account

### Setup Steps

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Install and verify: `node --version` and `npm --version`

2. **Navigate to project directory**
   ```bash
   cd RaktaSetu
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure MongoDB Atlas**
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster (free tier available)
   - Create a database user with read/write permissions
   - Get your connection string
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

5. **Configure environment variables**
   - Open `.env` file
   - Replace the MongoDB connection string:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>`, `<password>`, and cluster URL with your actual credentials
   - Change the SESSION_SECRET to a random string

6. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open your browser and navigate to: http://localhost:3000
   - You'll be redirected to the login page
   - Click "Register here" to create a new account

## Project Structure

```
RaktaSetu/
├── js/
│   └── app.js                # Frontend utilities and auth functions
├── .env                      # Environment variables (MongoDB credentials)
├── package.json              # Node.js dependencies
├── server.js                 # Express server with API routes
├── index.html                # Entry point (redirects to login)
├── login.html                # User login page
├── register.html             # User registration page
├── home.html                 # Dashboard with donor search
├── camps.html                # Blood camp management
├── requests.html             # Blood request management
└── profile.html              # User profile management
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/check-auth` - Check authentication status

### User Management
- `GET /api/user` - Get current user profile
- `PUT /api/user` - Update user profile

### Blood Donors
- `GET /api/donors` - Search for blood donors

### Blood Requests
- `POST /api/requests` - Create blood request
- `GET /api/requests/sent` - Get sent requests
- `GET /api/requests/received` - Get received requests
- `PUT /api/requests/:id` - Update request status

### Blood Camps
- `POST /api/camps` - Create blood camp
- `GET /api/camps` - Get all camps
- `POST /api/camps/:id/register` - Register for camp
- `GET /api/camps/registered` - Get registered camps

## Database Collections

The system uses the following MongoDB collections:

1. **users** - Stores user information and health details
2. **blood_requests** - Manages blood donation requests
3. **blood_camps** - Stores blood camp information
4. **camp_registrations** - Tracks user registrations for camps

## Usage

### For Blood Donors

1. Register with your complete health information
2. Mark yourself as "willing to donate"
3. Receive blood requests from patients
4. Accept or reject requests based on availability
5. Register for blood donation camps

### For Blood Recipients

1. Register on the platform
2. Search for donors by blood type and location
3. Send blood requests with urgency level
4. Track request status
5. Contact donors directly

## Security Features

- Password hashing using bcryptjs
- Session-based authentication
- Input sanitization and validation
- MongoDB injection prevention
- Secure HTTP headers

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Check username and password are correct

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 3000

## Support

For issues or questions, please contact the development team.

## License

This project is created for educational and humanitarian purposes.

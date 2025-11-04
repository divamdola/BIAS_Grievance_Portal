# College Grievance Management System 🎓

A comprehensive role-based grievance management system for colleges with three-tier access control.

## 🧩 User Hierarchy

### 🔴 Super Level (Director)
- **Email:** director@college.edu
- **Password:** admin123
- **Privileges:** View & resolve all complaints, handle escalated issues

### 🟠 Medium Level
- **HOD Computer Science**
  - Email: hod.cs@college.edu
  - Password: admin123
  - Handles: Academic complaints

- **HOD Mechanical**
  - Email: hod.mech@college.edu
  - Password: admin123
  - Handles: Academic complaints

- **Registrar**
  - Email: registrar@college.edu
  - Password: admin123
  - Handles: Teacher/Worker complaints

- **Hostel Warden**
  - Email: warden@college.edu
  - Password: admin123
  - Handles: Hostel complaints

### 🟢 Low Level (Students, Teachers, Workers)
- Can register via signup form
- Submit complaints based on type

## 📋 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Update `.env` file with your MongoDB URI and JWT secret:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=9000
MONGO_URI=your_mongodb_connection_string
```

4. Seed admin users to database:
```bash
node seedData.js
```

5. Start backend server:
```bash
npm run dev
```
Backend will run on: http://localhost:9000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend development server:
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

## 🚀 How to Use

1. **First-time Setup:**
   - Run seedData.js to create admin users
   - Open http://localhost:5173 in your browser

2. **Admin Login:**
   - Use any of the admin credentials listed above
   - Access role-specific dashboard

3. **User Registration:**
   - Click "Create Account" on login page
   - Only Students, Teachers, and Workers can register
   - Fill in details and department

4. **Complaint Flow:**
   - Students/Teachers/Workers submit complaints
   - Complaints auto-route based on type:
     - Academic → HOD
     - Hostel → Warden
     - Staff → Registrar
   - Medium-level users can escalate to Director if needed

## 🗂️ Project Structure

```
Bias_Grievances/
├── backend/
│   ├── controller/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── complaint.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── index.js
│   ├── seedData.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── DirectorDashboard.jsx
│   │   │   ├── MediumLevelDashboard.jsx
│   │   │   ├── LowLevelDashboard.jsx
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔐 Authentication Flow

- JWT-based authentication
- Token stored in localStorage
- Role-based access control
- Dynamic dashboard rendering based on user role

## 📊 Next Steps

- Implement complaint submission form for low-level users
- Create complaint management interface for medium/super level users
- Add real-time notifications
- Implement complaint status tracking
- Add file upload for complaint attachments

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT, bcryptjs

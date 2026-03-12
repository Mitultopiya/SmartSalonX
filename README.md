# Smart Salon & Parlour Management System

A comprehensive salon management system with AI-powered style recommendations, booking system, and notification features.

## 🚀 Features

### 🎨 AI Style Advisor
- Face shape analysis using AI
- Personalized hairstyle and beard recommendations
- Virtual try-on functionality
- 97+ style photos integrated

### 💇 Booking System
- Online appointment booking
- Real-time availability
- Multiple salon support
- Payment integration with Razorpay

### 🔔 Notifications
- Email notifications for appointments
- In-app notifications for barbers
- Automated appointment reminders

### 👥 User Management
- Role-based access (Admin, Barber, User)
- Authentication system
- Profile management

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Face-API.js

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3123
- **Backend API**: http://localhost:5000
- **Style Advisor**: http://localhost:3123/style-advisor

## 📁 Project Structure

```
smart-salon-system/
├── backend/                 # Node.js API server
│   ├── controllers/         # API controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
├── frontend/               # Next.js application
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── data/               # Static data
│   ├── lib/                # Utility libraries
│   └── public/             # Static assets
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in both `backend` and `frontend` directories.

Backend `.env`:
```
MONGODB_URI=mongodb://localhost:27017/salon_management
JWT_SECRET=your-jwt-secret
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
```

## 🎯 Usage

1. **For Users**: 
   - Sign up and upload photo for AI style analysis
   - Browse recommended styles
   - Book appointments

2. **For Barbers**:
   - Register and get approved
   - Manage schedule
   - View notifications

3. **For Admins**:
   - Manage users and barbers
   - Oversee bookings
   - System analytics

## 📱 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@smartsalon.com or create an issue in the repository.


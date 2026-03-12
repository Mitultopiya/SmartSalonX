import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import barberRoutes from './routes/barber.routes.js';
import adminRoutes from './routes/admin.routes.js';
import salonRoutes from './routes/salon.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import hairstyleRoutes from './routes/hairstyle.routes.js';
import faceAnalysisRoutes from './routes/faceAnalysis.js';
import styleRecommendationRoutes from './routes/styleRecommendations.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salon_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/hairstyles', hairstyleRoutes);
app.use('/api/face-analysis', faceAnalysisRoutes);
app.use('/api/style-recommendations', styleRecommendationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start appointment reminder scheduler
import appointmentReminderScheduler from './utils/appointmentReminder.js';
appointmentReminderScheduler.start();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
import Barber from '../models/Barber.model.js';
import User from '../models/User.model.js';
import Salon from '../models/Salon.model.js';
import Appointment from '../models/Appointment.model.js';
import Commission from '../models/Commission.model.js';
import Wallet from '../models/Wallet.model.js';
import Hairstyle from '../models/Hairstyle.model.js';
import moment from 'moment';
import { createNotification } from './notification.controller.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBarbers = await Barber.countDocuments({ status: 'approved' });
    const totalSalons = await Salon.countDocuments({ status: 'active' });
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'COMPLETED' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'PENDING_PAYMENT' });

    // Revenue calculation
    const revenueData = await Appointment.aggregate([
      { $match: { status: 'COMPLETED', 'payment.status': 'SUCCESS' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Commission calculation
    const commissionData = await Commission.aggregate([
      { $match: { status: 'blocked' } },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: '$amount' },
        },
      },
    ]);

    const totalCommission = commissionData[0]?.totalCommission || 0;

    res.json({
      totalUsers,
      totalBarbers,
      totalSalons,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalRevenue,
      totalCommission,
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPendingBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find({ status: 'pending' })
      .populate('userId', 'name email phone')
      .populate('salonId', 'name')
      .sort({ createdAt: -1 });

    res.json(barbers);
  } catch (error) {
    console.error('Get Pending Barbers Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const approveBarber = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('salonId', 'name');

    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    barber.status = 'approved';
    barber.approvedBy = req.user._id;
    barber.approvedAt = new Date();
    barber.certificate.verified = true;

    await barber.save();

    // Create in-app notification for barber
    console.log('📧 Creating in-app notification for barber...');
    console.log('📧 Barber data:', {
      barberId: barber._id,
      userId: barber.userId._id,
      userEmail: barber.userId.email,
      userName: barber.userId.name,
      salonName: barber.salonId.name,
      status: barber.status
    });

    try {
      await createNotification(
        barber.userId._id,
        '🎉 Certificate Approved!',
        `Congratulations! Your certificate has been approved. You can now start working at ${barber.salonId.name}.`,
        'certificate_approved',
        {
          relatedId: barber._id,
          relatedModel: 'Barber',
          actionUrl: '/barber/dashboard',
          metadata: {
            salonName: barber.salonId.name,
            approvedBy: req.user._id,
            approvedAt: new Date(),
          }
        }
      );
      console.log('✅ In-app notification created successfully for:', barber.userId.email);
    } catch (notificationError) {
      console.error('❌ Failed to create notification:', notificationError);
      console.error('❌ Notification error details:', {
        message: notificationError.message,
        stack: notificationError.stack,
        code: notificationError.code
      });
      // Continue with the response even if notification fails
    }

    res.json({ message: 'Barber approved successfully', barber });
  } catch (error) {
    console.error('Approve Barber Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rejectBarber = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    barber.status = 'rejected';
    barber.approvedBy = req.user._id;
    barber.approvedAt = new Date();

    await barber.save();

    res.json({ message: 'Barber rejected', barber });
  } catch (error) {
    console.error('Reject Barber Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find()
      .populate('userId', 'name email phone')
      .populate('salonId', 'name')
      .sort({ createdAt: -1 });

    res.json(barbers);
  } catch (error) {
    console.error('Get All Barbers Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(salons);
  } catch (error) {
    console.error('Get All Salons Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const releaseCommissions = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = moment(startDate || moment().subtract(7, 'days')).startOf('day');
    const end = moment(endDate || moment()).endOf('day');

    const commissions = await Commission.find({
      status: 'blocked',
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
    });

    let totalReleased = 0;

    for (const commission of commissions) {
      // Release commission from barber wallet
      const barber = await Barber.findById(commission.barberId);
      if (barber) {
        const wallet = await Wallet.findOne({ userId: barber.userId });
        if (wallet) {
          wallet.blockedCommission -= commission.amount;
          wallet.transactions.push({
            type: 'commission_release',
            amount: -commission.amount,
            description: `Commission released for appointment ${commission.appointmentId}`,
            appointmentId: commission.appointmentId,
          });
          await wallet.save();
        }
      }

      commission.status = 'released';
      commission.releasedAt = new Date();
      commission.settlementPeriod = { startDate: start.toDate(), endDate: end.toDate() };
      await commission.save();

      totalReleased += commission.amount;
    }

    res.json({
      message: 'Commissions released successfully',
      totalReleased,
      count: commissions.length,
    });
  } catch (error) {
    console.error('Release Commissions Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllHairstyles = async (req, res) => {
  try {
    const hairstyles = await Hairstyle.find().sort({ createdAt: -1 });
    res.json(hairstyles);
  } catch (error) {
    console.error('Get All Hairstyles Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.create(req.body);
    res.status(201).json(hairstyle);
  } catch (error) {
    console.error('Create Hairstyle Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!hairstyle) {
      return res.status(404).json({ message: 'Hairstyle not found' });
    }

    res.json(hairstyle);
  } catch (error) {
    console.error('Update Hairstyle Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByIdAndDelete(req.params.id);

    if (!hairstyle) {
      return res.status(404).json({ message: 'Hairstyle not found' });
    }

    res.json({ message: 'Hairstyle deleted successfully' });
  } catch (error) {
    console.error('Delete Hairstyle Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

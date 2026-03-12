import cron from 'node-cron';
import Appointment from '../models/Appointment.model.js';
import Barber from '../models/Barber.model.js';
import User from '../models/User.model.js';
import Salon from '../models/Salon.model.js';
import { sendAppointmentReminderEmail } from './email.js';

class AppointmentReminderScheduler {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('⏰ Appointment reminder scheduler is already running');
      return;
    }

    console.log('🚀 Starting appointment reminder scheduler...');
    
    // Run every minute to check for appointments that need reminders
    cron.schedule('* * * * *', async () => {
      await this.checkAndSendReminders();
    });

    this.isRunning = true;
    console.log('✅ Appointment reminder scheduler started successfully');
  }

  async checkAndSendReminders() {
    try {
      const now = new Date();
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
      const oneMinuteFromNow = new Date(now.getTime() + 1 * 60000); // 1 minute from now

      // Find appointments that are in 30 minutes (within a 1-minute window)
      const appointments = await Appointment.find({
        status: 'CONFIRMED', // Only confirmed appointments get reminders
        appointmentDate: {
          $gte: thirtyMinutesFromNow,
          $lte: oneMinuteFromNow
        },
        reminderSent: { $ne: true } // Haven't sent reminder yet
      })
      .populate('userId', 'name email')
      .populate('barberId', 'userId')
      .populate('salonId', 'name');

      console.log(`📅 Found ${appointments.length} appointments needing reminders`);

      for (const appointment of appointments) {
        try {
          // Get barber details
          const barber = await Barber.findById(appointment.barberId._id).populate('userId', 'name');
          
          if (!barber) {
            console.log('❌ Barber not found for appointment:', appointment._id);
            continue;
          }

          // Format appointment date and time
          const appointmentDate = appointment.appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          const appointmentTime = appointment.appointmentDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });

          // Send reminder email
          await sendAppointmentReminderEmail({
            to: appointment.userId.email,
            userName: appointment.userId.name,
            barberName: barber.userId.name,
            salonName: appointment.salonId.name,
            appointmentTime,
            appointmentDate,
          });

          // Mark reminder as sent
          appointment.reminderSent = true;
          await appointment.save();

          console.log(`✅ Reminder sent for appointment ${appointment._id} to ${appointment.userId.email}`);
        } catch (error) {
          console.error(`❌ Failed to send reminder for appointment ${appointment._id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error in appointment reminder scheduler:', error);
    }
  }

  stop() {
    if (!this.isRunning) {
      console.log('⏰ Appointment reminder scheduler is not running');
      return;
    }

    console.log('🛑 Stopping appointment reminder scheduler...');
    cron.getTasks().forEach((task) => task.stop());
    this.isRunning = false;
    console.log('✅ Appointment reminder scheduler stopped');
  }
}

// Create and export singleton instance
const appointmentReminderScheduler = new AppointmentReminderScheduler();

export default appointmentReminderScheduler;

import Appointment from '../models/Appointment.model.js';
import Transaction from '../models/Transaction.model.js';
import Barber from '../models/Barber.model.js';
import Wallet from '../models/Wallet.model.js';
import Commission from '../models/Commission.model.js';
import User from '../models/User.model.js';
import { checkSlotAvailability } from '../utils/appointmentUtils.js';
import { sendInvoiceEmail } from '../utils/email.js';

/**
 * Payment Simulation Module
 *
 * Why simulated:
 * - Examiner-safe: demonstrates full payment workflow without real gateway integration.
 * - Mimics real gateways: initiate -> pending transaction -> success/fail verification callback.
 * - Easy to swap later: replace simulate endpoint with real webhook verification.
 */

export const initiatePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ message: 'appointmentId is required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only the appointment owner can initiate payment
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (appointment.status !== 'PENDING_PAYMENT') {
      return res.status(400).json({ message: `Appointment is not in PENDING_PAYMENT state` });
    }

    // Lock slot by ensuring it is still available (idempotent retry safe)
    const isAvailable = await checkSlotAvailability(
      appointment.barberId,
      appointment.startTime,
      appointment.endTime,
      appointment._id
    );
    if (!isAvailable) {
      return res.status(409).json({ message: 'Time slot no longer available' });
    }

    // Reuse existing pending transaction if present
    const existingTx =
      appointment.payment?.transactionId
        ? await Transaction.findById(appointment.payment.transactionId)
        : null;

    if (existingTx && existingTx.status === 'PENDING') {
      return res.json({ transactionId: existingTx._id, status: existingTx.status });
    }

    const tx = await Transaction.create({
      appointmentId: appointment._id,
      userId: req.user._id,
      amount: appointment.finalAmount,
      status: 'PENDING',
      provider: 'SIMULATED_UPI',
    });

    appointment.payment.transactionId = tx._id;
    appointment.payment.amount = appointment.finalAmount;
    appointment.payment.status = 'PENDING';
    await appointment.save();

    res.json({ transactionId: tx._id, status: tx.status });
  } catch (error) {
    console.error('initiatePayment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const simulatePayment = async (req, res) => {
  try {
    const { appointmentId, transactionId, result } = req.body;
    if (!appointmentId || !transactionId || !result) {
      return res
        .status(400)
        .json({ message: 'appointmentId, transactionId and result are required' });
    }

    if (!['SUCCESS', 'FAILED'].includes(result)) {
      return res.status(400).json({ message: 'result must be SUCCESS or FAILED' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (appointment.status !== 'PENDING_PAYMENT') {
      return res.status(400).json({ message: 'Appointment is not in PENDING_PAYMENT state' });
    }

    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    if (tx.appointmentId.toString() !== appointment._id.toString()) {
      return res.status(400).json({ message: 'Transaction does not match appointment' });
    }

    // Idempotency: if already completed, return the current state
    if (tx.status !== 'PENDING') {
      return res.json({ message: 'Transaction already processed', transaction: tx, appointment });
    }

    if (result === 'FAILED') {
      tx.status = 'FAILED';
      await tx.save();

      appointment.status = 'CANCELLED';
      appointment.payment.status = 'FAILED';
      await appointment.save();

      return res.json({ message: 'Payment failed, appointment cancelled', transaction: tx, appointment });
    }

    // SUCCESS
    tx.status = 'SUCCESS';
    await tx.save();

    appointment.status = 'CONFIRMED';
    appointment.payment.status = 'SUCCESS';
    appointment.payment.paidAt = new Date();
    await appointment.save();

    // Wallet & commission updates (as per requirement)
    const barber = await Barber.findById(appointment.barberId);
    if (!barber) return res.status(404).json({ message: 'Barber not found' });

    let wallet = await Wallet.findOne({ userId: barber.userId });
    if (!wallet) wallet = await Wallet.create({ userId: barber.userId });

    const commissionAmount = appointment.finalAmount * 0.1;
    const barberAmount = appointment.finalAmount - commissionAmount;

    wallet.availableBalance += barberAmount;
    wallet.blockedCommission += commissionAmount;
    wallet.totalEarnings += appointment.finalAmount;
    wallet.transactions.push({
      type: 'credit',
      amount: barberAmount,
      description: `Simulated payment credit for appointment ${appointment._id}`,
      appointmentId: appointment._id,
    });
    wallet.transactions.push({
      type: 'commission_block',
      amount: commissionAmount,
      description: `Commission blocked for appointment ${appointment._id}`,
      appointmentId: appointment._id,
    });
    await wallet.save();

    await Commission.create({
      appointmentId: appointment._id,
      barberId: appointment.barberId,
      amount: commissionAmount,
      status: 'blocked',
    });

    // Send invoice email (simulated gateway receipt)
    try {
      const user = await User.findById(appointment.userId);
      if (user?.email) {
        const servicesList =
          appointment.services && appointment.services.length
            ? appointment.services
                .map(
                  (s) =>
                    `${s.name || 'Service'} - ₹${s.price || 0} (${s.duration || 0} min)`
                )
                .join('<br/>')
            : 'Service';

        const html = `
          <h2>Payment Receipt - SalonPro</h2>
          <p>Hi ${user.name || ''},</p>
          <p>Your payment has been <strong>successfully received</strong> for the following appointment:</p>
          <ul>
            <li><strong>Appointment ID:</strong> ${appointment._id}</li>
            <li><strong>Amount Paid:</strong> ₹${appointment.finalAmount}</li>
            <li><strong>Date:</strong> ${new Date(
              appointment.startTime
            ).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${new Date(
              appointment.startTime
            ).toLocaleTimeString()}</li>
          </ul>
          <p><strong>Services:</strong><br/>${servicesList}</p>
          <p>Thank you for using <strong>SalonPro</strong>.</p>
          <p style="font-size:12px;color:#666">This invoice is generated from a simulated payment gateway (test mode).</p>
        `;

        await sendInvoiceEmail({
          to: user.email,
          subject: 'SalonPro - Payment Receipt',
          html,
        });
      }
    } catch (emailErr) {
      console.error('Invoice email error:', emailErr);
    }

    return res.json({ message: 'Payment successful, appointment confirmed', transaction: tx, appointment });
  } catch (error) {
    console.error('simulatePayment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


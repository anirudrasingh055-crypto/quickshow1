import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    bookedSeats: [{ type: String }],
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: String, default: null },
    // Seat reservation expiry: if payment not made within 10 mins, seats released
    reservedUntil: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'expired'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Auto-expire bookings not paid within 10 mins (TTL index)
bookingSchema.index({ reservedUntil: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showDateTime: { type: Date, required: true },
    showPrice: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, default: 120 },
    // occupiedSeats: { seatId: userId }
    occupiedSeats: { type: Map, of: String, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Show = mongoose.model('Show', showSchema);
export default Show;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;

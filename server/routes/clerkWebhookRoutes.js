import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';

const router = express.Router();

// POST /api/webhooks/clerk - Sync Clerk users to MongoDB
router.post('/clerk', async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Verify webhook signature
  const svix = new Webhook(webhookSecret);
  let evt;

  try {
    evt = svix.verify(req.body, {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const { id, type, data } = evt;

  switch (type) {
    case 'user.created':
      await User.create({
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`.trim() || data.username || 'User',
        email: data.email_addresses[0]?.email_address || '',
        imageUrl: data.image_url || '',
        role: 'user',
      });
      console.log(`✅ Created user: ${data.id}`);
      break;

    case 'user.updated':
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          name: `${data.first_name} ${data.last_name}`.trim() || data.username,
          email: data.email_addresses[0]?.email_address,
          imageUrl: data.image_url,
        }
      );
      console.log(`✅ Updated user: ${data.id}`);
      break;

    case 'user.deleted':
      await User.findOneAndDelete({ clerkId: data.id });
      console.log(`✅ Deleted user: ${data.id}`);
      break;

    default:
      console.log(`⚠️ Unhandled webhook type: ${type}`);
  }

  res.json({ success: true });
});

export default router;

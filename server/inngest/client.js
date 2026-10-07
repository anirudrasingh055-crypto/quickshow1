import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'quickshow',
  name: 'QuickShow',
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// =============================================
// INNGEST FUNCTIONS
// =============================================

/**
 * 1. New Movie Email - Sends email to all users when a new movie is added
 */
export const sendNewMovieEmail = inngest.createFunction(
  { id: 'send-new-movie-email', name: 'New Movie - Email All Users' },
  { event: 'quickshow/movie.added' },
  async ({ event, step }) => {
    const { movie, users } = event.data;

    // Send email to each user (in batches to avoid rate limits)
    const results = await step.run('send-emails', async () => {
      const emailPromises = users.map(async (user) => {
        // In production, use nodemailer or a transactional email service
        console.log(`📧 Sending new movie email to ${user.email} about: ${movie.title}`);
        return { userId: user._id, sent: true };
      });
      return Promise.all(emailPromises);
    });

    return { emailsSent: results.length };
  }
);

/**
 * 2. Booking Confirmation Email
 */
export const sendBookingConfirmation = inngest.createFunction(
  { id: 'booking-confirmation-email', name: 'Booking Confirmation Email' },
  { event: 'quickshow/booking.confirmed' },
  async ({ event, step }) => {
    const { booking, user, movie, showTime } = event.data;

    await step.run('send-confirmation', async () => {
      console.log(`📧 Sending booking confirmation to ${user.email} for ${movie.title}`);
    });

    // Schedule reminder 2 hours before showtime
    const showDate = new Date(showTime);
    const reminderTime = new Date(showDate.getTime() - 2 * 60 * 60 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      await step.sleepUntil('wait-for-reminder', reminderTime.toISOString());

      await step.run('send-reminder', async () => {
        console.log(`⏰ Sending reminder to ${user.email} - Show in 2 hours!`);
      });
    }

    return { success: true };
  }
);

/**
 * 3. Seat Release - Releases seats if payment not made within 10 minutes
 */
export const releasePendingSeats = inngest.createFunction(
  { id: 'release-pending-seats', name: 'Release Unpaid Seat Reservations' },
  { event: 'quickshow/booking.created' },
  async ({ event, step }) => {
    const { bookingId, showId, seats } = event.data;

    // Wait 10 minutes
    await step.sleep('wait-10-minutes', '10m');

    // Check if still unpaid and release
    await step.run('check-and-release', async () => {
      console.log(`⏱ Checking booking ${bookingId} - releasing seats ${seats.join(', ')} if unpaid`);
      // In production: query DB, if isPaid=false, mark as expired and release seats on Show
    });

    return { bookingId, action: 'checked' };
  }
);

// Export all functions
export const functions = [
  sendNewMovieEmail,
  sendBookingConfirmation,
  releasePendingSeats,
];

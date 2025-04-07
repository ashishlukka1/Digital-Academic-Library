const cron = require("node-cron");
const Reservation = require("./Models/Reservation");
const twilioClient = require('./Twilio');

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    
    // Create a wider time window to catch reservations that were created ~1 minute ago
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

    console.log(`🔹 Now: ${now.toISOString()} (${now.toLocaleTimeString('en-US', { hour12: true })})`);
    console.log(`🔹 Checking window: ${twoMinutesAgo.toISOString()} -> ${thirtySecondsAgo.toISOString()}`);

    // Find reservations that were created approximately one minute ago
    const reservations = await Reservation.find({
      "reservation.status": "active",
      $or: [
        { createdAt: { $gte: twoMinutesAgo, $lte: thirtySecondsAgo } },
        { "reservation.createdAt": { $gte: twoMinutesAgo, $lte: thirtySecondsAgo } }
      ]
    });
    
    console.log("🔍 Reservations Found:", reservations.length);

    // For debugging, if no reservations found in time window
    if (reservations.length === 0) {
      // Check for ANY reservations
      const anyReservations = await Reservation.find().limit(3);
      console.log(`💡 DEBUG: Found ${anyReservations.length} total reservations in database`);
      
      if (anyReservations.length > 0) {
        console.log(`💡 Sample reservation:`, {
          id: anyReservations[0]._id,
          status: anyReservations[0].reservation.status,
          rootCreatedAt: anyReservations[0].createdAt,
          reservationCreatedAt: anyReservations[0].reservation.createdAt
        });
      }
      return;
    }

    for (const reservation of reservations) {
      const { phoneNumber, firstName } = reservation.user;
      const { title } = reservation.book;
      const { timeSlot, formattedDate } = reservation.reservation;

      // Create a shorter message to avoid Twilio trial message length limits
      const message = `📚 ${firstName}, your book "${title}" pickup: ${timeSlot}, ${formattedDate}. See you soon!`;

      // Send SMS
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phoneNumber}`
      });

      console.log(`✅ Reminder sent to ${phoneNumber} for book "${title}"`);
    }
  } catch (err) {
    console.error("❌ Error in cron job:", err);
  }
});
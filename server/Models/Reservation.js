const mongoose = require("mongoose");
const reservationSchema = new mongoose.Schema({
  user: {
    email: { type: String, required: true },
    firstName: { type: String },
    phoneNumber: { type: String }
  },
  book: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String },
    genre: { type: String },
  },
  reservation: {
    reservationId: { type: String, required: true },
    status: { type: String, default: "active" },
    timeSlot: { type: String },
    date: { type: Date, required: true },
    formattedDate: { type: String },
    createdAt: { type: Date }, // Move this inside reservation object
  },
  createdAt: { type: Date, default: Date.now }, // Keep this for compatibility
});
module.exports = mongoose.model("Reservation", reservationSchema);
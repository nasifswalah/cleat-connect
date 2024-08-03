import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  bookedBy: {
    type: String,
    required: true,
  },
  turfId: {
    type: String,
    required: true,
  },
  turfName: {
    type: String,
    required: true,
  },
  timeSlotIds: {
    type: Array,
    required: true,
  },
  timeSlotNames: {
    type: Array,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  bookingDate:{
    type: Date,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
},
{ timestamps: true},
);

const Bookings = mongoose.model("booking", bookingSchema);

export default Bookings;


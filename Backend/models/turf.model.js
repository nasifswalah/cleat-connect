import mongoose from "mongoose";

const turfSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      min: 10
    },
    turfType: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    bookings: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "booking",
        },
      ],
    },
  },
  { timestamps: true }
);

const Turfs = mongoose.model("turf", turfSchema);

export default Turfs;

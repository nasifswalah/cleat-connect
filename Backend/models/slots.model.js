import mongoose from "mongoose";

const slotsSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  slot: {
    type: Object,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  bookedBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  turfId: {
   type: String,
   required: true
  },
  orderId: {
    type: mongoose.Types.ObjectId,
    ref: "booking",
  },
}
);

const Slots = mongoose.model("slot", slotsSchema);
slotsSchema.index({date:1,'slot.id':1,turfId:1},{unique:true})
export default Slots;

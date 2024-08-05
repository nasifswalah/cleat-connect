import Razorpay from "razorpay";
import crypto from "crypto";
import Slots from "../models/slots.model.js";
import { errorHandler } from "../utils/error.handler.js";
import Bookings from "../models/booking.model.js";
import Turfs from "../models/turf.model.js";


export const bookings = async (req, res, next) => {
  try {
    const { turfId, timeSlotIds, turfName, timeSlotNames } = req.body;

    const slotData = await Slots.find({ _id: { $in: timeSlotIds } });
    let totalCost = 0;

    for (let slot of slotData) {
      if (slot.bookedBy) {
        return next(errorHandler(400, "Slot already booked"));
      } else {
        totalCost += slot.cost;
      }
    }

    const newBooking = await Bookings({
      turfId,
      timeSlotIds,
      timeSlotNames,
      turfName,
      bookedBy: req.user._id,
      bookedByName: req.user.name,
      totalCost: totalCost,
      paymentStatus: "Pending",
    }).save();

    if (!newBooking) {
      return next(errorHandler(500,'Try again later'))
    }

    await Turfs.findByIdAndUpdate(turfId, {
      $push: { bookings: newBooking._id },
    });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: totalCost * 100,
      currency: "INR",
      receipt: newBooking._id,
    };

    const booking = await instance.orders.create(options);
    if (!booking) {
      return next(errorHandler(500, "Error on creating booking"));
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const success = async (req, res, next) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      receipt,
      timeSlotIds,
      timeSlotNames,
      turfId,
      turfName,
      bookingDate,
    } = req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    await Slots.updateMany(
      { _id: { $in: timeSlotIds } },
      { $set: { bookedBy: req.user._id, orderId: receipt } }
    );
    

   const updatedData = await Bookings.updateOne(
      { _id: receipt },
      {
        $set: {
          paymentStatus: "Paid",
          bookedBy: req.user.email,
          turfId,
          turfName,
          timeSlotNames,
          bookingDate: new Date(bookingDate),
        },
      }
    );

    if(!updatedData) {
      return next(errorHandler(404, 'Booking not found'))
    }


    res.status(200).json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    next(error);
  }
};


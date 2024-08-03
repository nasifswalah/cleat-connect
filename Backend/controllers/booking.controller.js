import Razorpay from "razorpay";
import crypto from "crypto";
import Slots from "../models/slots.model.js";
import { errorHandler } from "../utils/error.handler.js";
import Bookings from "../models/booking.model.js";
import Turfs from "../models/turf.model.js";
import nodemailer from 'nodemailer';

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
      totalCost: totalCost,
      paymentStatus: "Pending",
    }).save();

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
    

   await Bookings.updateOne(
      { _id: receipt },
      {
        $set: {
          paymentStatus: "Paid",
          bookedBy: req.user._id,
          turfId,
          turfName,
          bookingDate: new Date(bookingDate),
        },
      }
    );


    res.status(200).json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    next(error);
  }
};

export const bookingConfirmation = async (req, res, next) => {
  try {
    const { userName, userEmail, turfId, bookedSlots } = req.body;
    const slotName = [];
    let totalCost = 0;

    bookedSlots.map((slot) => (
      slotName.push(slot.slot.name)
    ));

    bookedSlots.map((slot) => (
      totalCost = slot.cost
    ));

    const turfData = await Turfs.findOne({ _id: turfId });

    const text = `
  Hello ${userName},

  Thank you for your booking!

  Booking Details:
  - Turf: ${turfData.name}
  - Time: ${slotName}
  - Amount Paid: ${totalCost}

  We look forward to seeing you!

  Best regards,
  Cleat Connect
  `;

    // HTML version of the email
    const html = `
  <p>Hello ${userName},</p>
  <p>Thank you for your booking!</p>
  <p><strong>Booking Details:</strong></p>
  <ul>
    <li><strong>Turf:</strong> ${turfData.name}</li>
    <li><strong>Time:</strong> ${slotName}</li>
    <li><strong>Amount Paid:</strong> ${totalCost}</li>
  </ul>
  <p>We look forward to seeing you!</p>
  <p>Best regards,<br><strong>Cleat Connect</strong></p>
  `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_AUTH_ID,
        pass: process.env.NODEMAILER_AUTH_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Cleat Connect" <${process.env.NODEMAILER_AUTH_ID}>`,
      to: userEmail,
      subject: "Cleat Connect - Booking confirmation",
      text: text,
      html: html,
    };

    const mail = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", mail.messageId);
    res.status(200).json("Confirmation mail has been send");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

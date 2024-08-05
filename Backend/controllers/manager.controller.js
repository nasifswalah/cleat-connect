import Slots from "../models/slots.model.js";
import Turfs from "../models/turf.model.js";
import Bookings from '../models/booking.model.js';
import { errorHandler } from "../utils/error.handler.js";
import nodemailer from 'nodemailer';


export const createTimeSlots = async (req, res, next) => {
  try {
    const { startDate, endDate, cost, turfId, selectedSlots } = req.body;

    const turfData = await Turfs.findOne({_id : turfId});
    if(req.user.email !== turfData.manager){
      return next(errorHandler(403, 'You are not allowed to create slots in this turf'));
    }

    let from = new Date(new Date(startDate).setUTCHours(0,0,0,0));
    let to = new Date(new Date(endDate).setUTCHours(0,0,0,0));
    const slotObjects = [];

    
    while (from <= to) {
      for (let slotData of selectedSlots) {
        slotObjects.push({
          date: JSON.parse(JSON.stringify(from)),
          slot: {
            name: slotData.name,
            id: slotData.id,
          },
          cost,
          turfId,
        });
      }
      from.setDate(from.getDate()+1);
    }
    const newSlots = await Slots.insertMany(slotObjects);
    res.status(201).json({
      success: true,
      message: "New slots added successfully",
      data: newSlots
    });
  } catch (error) {
    next(error);
  }
};

export const manageBookings = async (req, res, next) => {
  try {
    const myTurfData = await Turfs.find({manager: req.user.email});
    
    const turf = myTurfData.find(turf => turf._id);
      
    const bookings = await Bookings.find({turfId: turf._id});

    if(bookings.length === 0){
      return next(errorHandler(404, "No bookings yet!"));
    }
    

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async(req, res, next) => {
  try {
    const data = await Bookings.findByIdAndDelete(req.params.id);
    if (!data) {
      return next(errorHandler(404, 'Booking not found'));
    }

    const turfId = data.turfId;
    const turfData = await Turfs.findByIdAndUpdate(turfId, {
      $pull: { bookings: req.params.id },
    });
    if (!turfData) {
      return next(errorHandler(404, 'Booking not listed yet in turf'));
    }

    const timeSlotIds = data.timeSlotIds;
    await Slots.updateMany(
      { _id: { $in: timeSlotIds } },
      { $set: { bookedBy: null, orderId: null } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled',
      data,
    })
  } catch (error) {
    next(error);
  }
}

export const bookingConfirmation = async (req, res, next) => {
  try {
    const { bookedByName, bookedBy, turfId, timeSlotNames, totalCost, subject, content } = req.body;

    const turfData = await Turfs.findOne({ _id: turfId });

    const text = `
  Hello ${bookedByName},

  ${content}

  Booking Details:
  - Turf: ${turfData.name}
  - Time: ${timeSlotNames}
  - Amount Paid: ${totalCost}

  We look forward to seeing you!

  Best regards,
  Cleat Connect
  `;

    // HTML version of the email
    const html = `
  <p>Hello ${bookedByName},</p>
  <p>${content}</p>
  <p><strong>Booking Details:</strong></p>
  <ul>
    <li><strong>Turf:</strong> ${turfData.name}</li>
    <li><strong>Time:</strong> ${timeSlotNames}</li>
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
      to: bookedBy,
      subject: `Cleat Connect - ${subject}`,
      text: text,
      html: html,
    };

    const mail = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "E-mail has been send"
    });
  } catch (error) {
    next(error);
  }
};






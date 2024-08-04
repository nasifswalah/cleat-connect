import Bookings from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Slots from "../models/slots.model.js";
import Turfs from "../models/turf.model.js";
import { errorHandler } from "../utils/error.handler.js";


export const getAllTurfData = async (req, res, next) => {
  try {
    const allTurfsData = await Turfs.find();
    if (!allTurfsData) {
      return next(errorHandler(404, "Turfs are not found"));
    }

    return res.status(200).json({
      success: true,
      data: allTurfsData,
    });
  } catch (error) {
    next(error);
  }
};

export const getSelectedTurfData = async (req, res, next) => {
  try {
    const turfId = req.params.id;
    const turfData = await Turfs.findOne({ _id: turfId });
    if (!turfData) {
      return next(errorHandler(404, "Turf not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Selected turf details are listed below",
      data: turfData,
    });
  } catch (error) {
    next(error);
  }
};

export const getTimeSlots = async (req, res, next) => {
  try {
    let currentHour = 0;
    let currentDate = new Date(req.query.date);
    if (new Date(new Date().setUTCHours(0, 0, 0, 0)) === currentDate) {
      currentHour = new Date().getHours();
    }

    const availableSlots = await Slots.aggregate([
      {
        $match: {
          turfId: req.query.turfId,
          date: currentDate,
          'slot.id': { $gte: currentHour },
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          bookedBy: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Slots are listed",
      data: availableSlots
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const listBookings = async (req, res, next) => {
  try {
    const {userId} = req.user._id;
    const turfBookings = await Bookings.find({bookedBy: userId});

    if(!turfBookings) {
      return next(errorHandler(404, "Bookings are empty"));
    }

    res.status(200).json({
      success: true,
      message: "Bookings are listed successfully",
      data: turfBookings
    })
  } catch (error) {
    next(error);
  }
};

export const searchCourts = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;

    const searchResult = await Turfs.find({ name : { $regex: searchTerm, $options: 'i'}});

    if(!searchResult){
      return next(errorHandler(404, 'No such data'));
    }

    res.status(200).json({
      success: true,
      data: searchResult
    });
  } catch (error) {
    next(error);
  }
}

export const postReview = async (req, res, next) => {
  try {
    const reviewData = await Review.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Review Posted',
      data: reviewData
    });
  } catch (error) {
    next(error)
  }
}

export const getReview = async (req, res, next) => {
  try {
    const turfId = req.params.id;
    if(!turfId) return next(errorHandler(404, 'No reviews posted yet'));

    const reviews = await Review.find({postedFor:turfId});
    res.status(200).json({
      success: true,
      data: reviews
    })
  } catch (error) {
    next(error)
  }
}

export const viewBookings = async (req, res, next) => {
  try {
    const bookings = await Bookings.find({bookedBy : req.user.email});
    if(bookings.length === 0){
      return next(errorHandler(404, 'No bookings'));
    }

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch(error) {
    next(error);
  }
}

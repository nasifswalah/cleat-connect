import Turfs from "../models/turf.model.js";
import { errorHandler } from "../utils/error.handler.js";

export const createTurf = async (req, res, next) => {
  try {
    const turfData = await Turfs.create(req.body);
    res.status(201).json({
      success: true,
      message: "Turf created successfully",
      data: turfData
    })
  } catch (error) {
    next(error);
  }
};

export const updateTurf = async (req, res, next) => {
  try {
    const turfData = await Turfs.findById(req.params.id);

    if (!turfData) {
      return next(errorHandler(404, "Turf not found"));
    }

    if (req.user._id != turfData.createdBy) {
      return next(errorHandler(401, "You cannot edit this turf details"));
    }

    const updatedTurfData = await Turfs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Turf data updated successfully",
      data: updatedTurfData
    });
  } catch (error) {
    next(error);
  }
};


export const deleteTurf = async (req, res, next) => {
  try {
    const turfData = await Turfs.findById(req.params.id);

    if (!turfData) {
      return next(errorHandler(404, "Turf not found"));
    }

    if (req.user._id !== turfData.createdBy.toString()) {
      return next(errorHandler(401, "You can't delete this turf"));
    }

    await Turfs.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Turf deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTurfs = async (req, res, next) => {
  try {
    const myTurfs = await Turfs.find({ createdBy: req.user._id });

    if (!myTurfs) {
      return next(
        errorHandler(404, "You should create atleast one turf first")
      );
    }

    res.status(200).json({
      success: true,
      data: myTurfs
    });
  } catch (error) {
    next(error);
  }
};

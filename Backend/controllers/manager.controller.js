import Slots from "../models/slots.model.js";
import Turfs from "../models/turf.model.js";
import { errorHandler } from "../utils/error.handler.js";


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

export const manageMyTurf = async (req, res, next) => {
  try {
    const myTurfData = await Turfs.find({manager: req.user.email});

    if(!myTurfData){
      return next(errorHandler(404, "Turf data not found"));
    }

    res.status(200).json({
      success: true,
      data: myTurfData
    });
  } catch (error) {
    next(error);
  }
};




import express from "express";
import { bookingConfirmation, cancelBooking, createTimeSlots,  manageBookings} from "../controllers/manager.controller.js";
import { managerAuthorization } from "../utils/authorization.js";

const router = express.Router();

router.post("/create-slot", managerAuthorization, createTimeSlots);
router.get("/manage-bookings", managerAuthorization, manageBookings);
router.delete("/cancel-booking/:id", managerAuthorization, cancelBooking);
router.post("/confirmation", managerAuthorization, bookingConfirmation);


export default router;


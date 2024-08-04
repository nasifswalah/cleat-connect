import express from "express";
import { bookings, success} from "../controllers/booking.controller.js";
import { userAuthorization } from "../utils/authorization.js";

const router = express.Router();

router.post("/book-slot", userAuthorization, bookings);
router.post("/verify-booking", userAuthorization, success);

export default router;

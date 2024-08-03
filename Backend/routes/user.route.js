import express from "express";
import {
  getAllTurfData,
  getReview,
  getSelectedTurfData,
  getTimeSlots,
  listBookings,
  postReview,
  searchCourts,
} from "../controllers/user.controller.js";
import { userAuthorization } from "../utils/authorization.js";

const router = express.Router();

router.get("/get-turfs", getAllTurfData);
router.get("/get-turf/:id", getSelectedTurfData);
router.get("/get-slots", userAuthorization, getTimeSlots);
router.post("/list-bookings", userAuthorization, listBookings);
router.get('/search-booking', searchCourts);
router.post('/post-review', userAuthorization, postReview);
router.get('/get-review/:id', getReview);

export default router;

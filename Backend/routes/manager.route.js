import express from "express";
import { createTimeSlots,  manageMyTurf} from "../controllers/manager.controller.js";
import { managerAuthorization } from "../utils/authorization.js";

const router = express.Router();

router.post("/create-slot", managerAuthorization, createTimeSlots);
router.get("/manage-my-turf", managerAuthorization, manageMyTurf);


export default router;


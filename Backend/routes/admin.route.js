import express from "express";
import { adminAuthorization } from "../utils/authorization.js";
import {
  createTurf,
  deleteTurf,
  getMyTurfs,
  updateTurf,
} from "../controllers/admin.controller.js";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/create-turf", adminAuthorization, createTurf);
router.post("/create-user", adminAuthorization, register);
router.post("/update-turf/:id", adminAuthorization, updateTurf);
router.delete("/delete-turf/:id", adminAuthorization, deleteTurf);
router.get("/get-my-turf", adminAuthorization, getMyTurfs);

export default router;

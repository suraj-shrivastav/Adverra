import express from "express";
import { generateAudio, getAudios } from "../controllers/audio.controller.js";
import { authenticateUser } from "../middleware/auth.js";
const router = express.Router();

router.post("/", authenticateUser, generateAudio);
router.get("/", authenticateUser, getAudios);

export default router;

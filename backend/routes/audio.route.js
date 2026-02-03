import express from "express";
import { generateAudio } from "../controllers/audio.controller.js";
const router = express.Router();

router.post("/", generateAudio);

export default router;

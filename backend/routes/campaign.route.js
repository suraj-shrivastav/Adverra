import express from "express";
import { createCampaign, getCampaigns } from "../controllers/campaign.controller.js";
import { authenticateUser } from "../middleware/auth.js"

const router = express.Router();

router.post("/", authenticateUser, createCampaign);
router.get("/", authenticateUser, getCampaigns);

export default router;
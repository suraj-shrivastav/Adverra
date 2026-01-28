import express from "express";
import { addCustomBrandData, extractBrandData, getAllBrandData } from "../controllers/brand.controller.js";
const router = express.Router();

router.post("/extract", extractBrandData);
router.post("/", addCustomBrandData);
router.get("/", getAllBrandData);

export default router;
import express from "express";
import { generateImage, getAssets, uploadReferenceImage } from "../controllers/asset.controller.js";
import { authenticateUser } from "../middleware/auth.js"
import multer from "multer";
import os from "os";

const upload = multer({ dest: os.tmpdir() });
const router = express.Router();

router.post("/generate", authenticateUser, generateImage);
router.post("/upload-reference", authenticateUser, upload.single("image"), uploadReferenceImage);
router.get("/", authenticateUser, getAssets)

export default router;
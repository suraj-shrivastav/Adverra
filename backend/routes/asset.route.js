import express from "express";
import { generateImage, uploadReferenceImage } from "../controllers/asset.controller.js";
import multer from "multer";
import os from "os";

const upload = multer({ dest: os.tmpdir() });
const router = express.Router();

router.post("/generate", generateImage);
router.post("/upload-reference", upload.single("image"), uploadReferenceImage);

export default router;
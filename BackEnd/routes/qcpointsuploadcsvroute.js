import express from "express";
import multer from "multer";
import { uploadQCPointsCSV } from "../controllers/uploadqcPointControllercsv.js";

const router = express.Router();

// Store uploaded CSV temporarily in "uploads" folder
const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", upload.single("file"), uploadQCPointsCSV);

export default router;

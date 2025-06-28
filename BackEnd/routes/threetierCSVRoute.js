import express from "express";
import multer from "multer";
import { uploadIPCSV } from "../controllers/threetierController.js";

const router = express.Router();

// Configure multer → store uploaded CSV temporarily in uploads/
const upload = multer({ storage: multer.memoryStorage() });

// Define route
router.post("/upload-csv", upload.single("file"), uploadIPCSV);

export default router;

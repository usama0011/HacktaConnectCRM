import express from "express";
import multer from "multer";
import { uploadAttendanceCSV } from "../controllers/threetierattendanceController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post("/upload-csv", upload.single("file"), uploadAttendanceCSV);

export default router;

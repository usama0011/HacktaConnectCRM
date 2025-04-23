import express from "express";
import { addMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", addMessage);
router.get("/:taskId", getMessages);

export default router;

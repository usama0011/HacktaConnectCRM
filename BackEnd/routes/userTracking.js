// /routes/userTracking.js
import express from "express";
import { trackMangoUser } from "../utils/mangoProxyService.js";

const router = express.Router();

router.get("/track-user", async (req, res) => {
  const ip = req.query.ip || req.ip;

  const trackingData = await trackMangoUser(ip);

  if (trackingData) {
    res.status(200).json(trackingData);
  } else {
    res.status(500).json({ message: "Failed to track user via Mango Proxy" });
  }
});

export default router;

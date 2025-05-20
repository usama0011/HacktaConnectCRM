import express from "express";
;
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";
import { getStatistics } from "../controllers/infaticacontroller.js";

const router = express.Router();

router.get("/traffic-usage",adminSideAuthMiddleware, getStatistics);

export default router;

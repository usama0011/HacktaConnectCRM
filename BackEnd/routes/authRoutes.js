import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  editUser,
  deleteUser,
  getSingleUser,
  CheckSuperAdiminUser,
  getAllAgents,
  getAllManagementUsers,
  getAgentCountByShift,
  uploadCSVWithBank,
  uploadCSVWithoutBank, // ✅ New Controller
} from "../controllers/authController.js";
import multer from "multer";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Signup (Register)
router.post("/signup",adminSideAuthMiddleware, registerUser);
router.get("/users",  getAllUsers);
router.get("/user/:id", getSingleUser); // ✅ New Route

// Login
router.post("/login", loginUser);
router.put("/edit/:id", editUser); // PUT /api/auth/edit/:id

router.post("/upload-csv/with-bank", upload.single("csv"), uploadCSVWithBank);
router.post("/upload-csv/no-bank", upload.single("csv"), uploadCSVWithoutBank);
// Logout
router.post("/logout", logoutUser);
router.get("/check-superadmin", CheckSuperAdiminUser);
router.delete("/delete/:id", deleteUser);
router.get("/agents",adminSideAuthMiddleware, getAllAgents);
router.get("/management", adminSideAuthMiddleware, getAllManagementUsers);
// ✅ New Route: Get Agent Count by Shift
router.get("/agents/shift-count", adminSideAuthMiddleware, getAgentCountByShift);
export default router;

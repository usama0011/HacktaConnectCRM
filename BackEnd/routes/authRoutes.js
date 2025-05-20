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
  getAgentCountByShift, // ✅ New Controller
} from "../controllers/authController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup (Register)
router.post("/signup", registerUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getSingleUser); // ✅ New Route

// Login
router.post("/login", loginUser);
router.put("/edit/:id", editUser); // PUT /api/auth/edit/:id

// Logout
router.post("/logout", logoutUser);
router.get("/check-superadmin", CheckSuperAdiminUser);
router.delete("/delete/:id", deleteUser);
router.get("/agents",adminSideAuthMiddleware, getAllAgents);
router.get("/management", adminSideAuthMiddleware, getAllManagementUsers);
// ✅ New Route: Get Agent Count by Shift
router.get("/agents/shift-count", adminSideAuthMiddleware, getAgentCountByShift);
export default router;

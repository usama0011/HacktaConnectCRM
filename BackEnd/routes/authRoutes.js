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
} from "../controllers/authController.js";

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
router.get("/agents", getAllAgents);
router.get("/management", getAllManagementUsers);
export default router;

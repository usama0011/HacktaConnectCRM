import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import Attendance from "../models/attendanceModel.js";

// controllers/authController.js

// Get Single User by ID
export const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

// controllers/userController.js
export const registerUser = async (req, res) => {
  const {
    username,
    password,
    role,
    shift,
    agentType,
    agentName,
    accountTitle,
    bankName,
    bankNumber,
    branch,
    joiningDate,
    cnic,
    userImage,
  } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      shift,
      agentType,
      agentName,
      accountTitle,
      bankName,
      bankNumber,
      branch,
      joiningDate,
      cnic,
      userImage,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **User Login**
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, "usama226390", {
      expiresIn: "1d",
    });

    // Mark Attendance (One entry per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      userId: user._id,
      date: today,
    });

    if (!attendance) {
      attendance = new Attendance({
        userId: user._id,
        username: user.username,
        status: "Present",
        checkInTime: new Date(),
      });
      await attendance.save();
    }

    res.json({ message: "Login successful", token, user, attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **User Logout**
export const logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: today },
      { checkOutTime: new Date() },
      { new: true }
    );

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today" });
    }

    res.json({ message: "Logout successful", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/authController.js or userController.js

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

// Update User (Edit API)
export const editUser = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    role,
    shift,
    bankName,
    bankNumber,
    agentName,
    accountTitle,
    agentType,
    branch,
    joiningDate,
    cnic,
    userImage,
  } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash password if updated
    let updatedPassword = user.password;
    if (password && password !== "") {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Update all fields (only if they exist in the request)
    user.username = username || user.username;
    user.password = updatedPassword;
    user.role = role || user.role;
    user.shift = shift || user.shift;
    user.bankName = bankName || user.bankName;
    user.bankNumber = bankNumber || user.bankNumber;
    user.agentName = agentName || user.agentName;
    user.accountTitle = accountTitle || user.accountTitle;
    user.agentType = agentType || user.agentType;
    user.branch = branch || user.branch;
    user.joiningDate = joiningDate || user.joiningDate;
    user.cnic = cnic || user.cnic;
    user.userImage = userImage || user.userImage;

    // Save updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

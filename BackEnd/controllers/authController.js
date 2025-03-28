import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import Attendance from "../models/attendanceModel.js";

// **User Registration (Signup)**
export const registerUser = async (req, res) => {
  const { username, password, role, shift } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      shift,
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

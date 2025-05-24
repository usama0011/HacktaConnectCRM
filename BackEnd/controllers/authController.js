import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import Attendance from "../models/attendanceModel.js";
import moment from 'moment'
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
    bankaccountstatus,
    CreatedBy,
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
      bankaccountstatus,
      joiningDate,
      cnic,
      userImage,
      CreatedBy,
      
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === "agent") {
      const now = moment();
      const today = moment().format("YYYY-MM-DD");

      let shiftStart = moment(`${today} ${user.shiftStartTime}`, "YYYY-MM-DD hh:mm A");
      let shiftEnd = moment(`${today} ${user.shiftEndTime}`, "YYYY-MM-DD hh:mm A");

      // Handle overnight (e.g., 12 AM to 8 AM)
      if (shiftEnd.isBefore(shiftStart)) {
        shiftEnd.add(1, "day");
      }

      // ✅ Add 30-minute grace before shift and after shift
      const allowedStart = shiftStart.clone().subtract(30, "minutes");
      const allowedEnd = shiftEnd.clone().add(30, "minutes");

      if (!now.isBetween(allowedStart, allowedEnd)) {
        return res.status(403).json({
          message: `Login only allowed from ${allowedStart.format("hh:mm A")} to ${allowedEnd.format("hh:mm A")}`,
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        shift: user.shift || null,
        branch: user.branch || null,
        agentType: user.agentType || null,
      },
      "usama226390@",
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
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
    bankaccountstatus,
    userImage,
    editorUsername, // 🆕 Add editor fields
    editorAvatar, // 🆕 Add editor fields
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

    // Update all fields
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
    user.bankaccountstatus = bankaccountstatus || user.bankaccountstatus;

    // ✨ Push Edit History (coming from req.body now)
    if (editorUsername && editorAvatar) {
      user.editHistory = user.editHistory || [];
      user.editHistory.push({
        editedByUsername: editorUsername,
        editedByAvatar: editorAvatar,
        editedAt: new Date(),
      });
    }

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

// 👇 NEW ROUTE to check if a Super Admin exists
export const CheckSuperAdiminUser = async (req, res) => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "Super Admin" });

    if (existingSuperAdmin) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking superadmin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// For fetching only Agents
export const getAllAgents = async (req, res) => {
  try {
    const { username, shift, agentType, branch } = req.query;
    const query = { role: "agent" };
       console.log(req.user)
    // Restrict Team Lead to view only their shift agents
    if (req.user.role === "Team Lead") {
      query.shift = req.user.shift; // Only show agents with the Team Lead's shift
    }

    // Apply query filters if provided
    if (username) {
      query.username = { $regex: username, $options: "i" };
    }
    if (shift) {
      query.shift = shift;
    }
    if (agentType) {
      query.agentType = agentType;
    }
    if (branch) {
      query.branch = branch;
    }

    const agents = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(agents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch agents", error: error.message });
  }
};


// For fetching Management Users (non-agents)
export const getAllManagementUsers = async (req, res) => {
  try {
    const { username, shift, branch } = req.query;
    const query = { role: { $ne: "agent" } };

    if (username) {
      query.username = { $regex: username, $options: "i" };
    }
    if (shift) {
      query.shift = shift;
    }
    if (branch) {
      query.branch = branch;
    }

    const managementUsers = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(managementUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch management users",
      error: error.message,
    });
  }
};
export const getAgentCountByShift = async (req, res) => {
  try {
    // Fetch all agents (role: agent)
    const agents = await User.find({ role: "agent" });

    // Calculate the count of agents for each shift
    const shiftCounts = {
      morning: 0,
      evening: 0,
      night: 0,
      unknown: 0,
    };

    agents.forEach((agent) => {
      const shift = agent.shift ? agent.shift.toLowerCase() : "unknown";
      if (shiftCounts[shift] !== undefined) {
        shiftCounts[shift]++;
      } else {
        shiftCounts.unknown++;
      }
    });

    res.status(200).json({
      success: true,
      shiftCounts,
      totalAgents: agents.length,
    });
  } catch (error) {
    console.error("Error fetching agent shift count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch agent shift count",
      error: error.message,
    });
  }
};
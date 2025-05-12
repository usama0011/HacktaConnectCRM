import jwt from "jsonwebtoken";

// Agent Authentication Middleware with Token Verification
const agentAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "usama226390@");
    req.user = decoded; // Attach user info to request

    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Access denied. Agents only." });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Admin-Side Authentication Middleware with Token Verification
const adminSideAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];


  try {
    const decoded = jwt.verify(token, "usama226390@");
    req.user = decoded; // Attach user info to request
    const allowedRoles = [
      "Super Admin",
      "HR",
      "Floor Manager",
      "Assistant Floor Manager",
      "Team Lead",
      "Team Lead WFH",
      "QC"
    ];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Admin-Side roles only." });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Export the middlewares
export { agentAuthMiddleware, adminSideAuthMiddleware };

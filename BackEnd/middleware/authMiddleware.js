import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "Super Admin")
  ) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Use named exports instead of default export
export { authMiddleware, adminMiddleware };

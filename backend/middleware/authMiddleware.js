const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    // Check if user role is allowed
    if (roles && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;



// const authMiddleware = (allowedRoles) => async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user || !allowedRoles.includes(user.role)) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     req.user = user; // Add user to request object for subsequent handlers
//     next();
//   } catch (err) {
//     console.error("Authentication error:", err);
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// module.exports = authMiddleware;

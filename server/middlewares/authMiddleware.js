const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .json({ success: false, message: "JWT_SECRET is not configured" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, admin not found" });
      }
      if (!["admin", "SuperAdmin"].includes(req.admin.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized for admin access" });
      }
      if (
        req.admin.mustChangePassword &&
        req.path !== "/me" &&
        req.path !== "/change-password"
      ) {
        return res.status(403).json({
          success: false,
          message: "Password change required before continuing",
        });
      }
      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" });
  }
};

module.exports = { protectAdmin };

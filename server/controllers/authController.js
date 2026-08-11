const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          mustChangePassword: !!admin.mustChangePassword,
          token: generateToken(admin._id),
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in admin
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

// @desc    Change admin password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide current and new password",
        });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters long",
        });
    }

    if (
      new Set(newPassword.toLowerCase()).size < 4 ||
      /^(.)\1+$/.test(newPassword)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "New password is too weak" });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password and confirmation do not match",
        });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin account not found" });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    admin.mustChangePassword = false;
    await admin.save();

    res.json({
      success: true,
      message:
        "Password updated successfully. Please use your new password for future sign-ins.",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mustChangePassword: false,
        token: generateToken(admin._id),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
const logoutAdmin = async (req, res, next) => {
  res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { loginAdmin, getMe, changePassword, logoutAdmin };

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const academicRoutes = require("./routes/academicRoutes");
const courseRoutes = require("./routes/courseRoutes");
const activityRoutes = require("./routes/activityRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const newsRoutes = require("./routes/newsRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const feeRoutes = require("./routes/feeRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const achievementRoutes = require("./routes/achievementRoutes");

// Initialize express app
const app = express();

// Essential Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://127.0.0.1:5173"]),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
  }),
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many enquiries submitted. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Rate Limiter for Login API to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", loginLimiter);
app.use("/api/enquiries", (req, res, next) => {
  if (req.method === "POST") return enquiryLimiter(req, res, next);
  return next();
});

// Base route test
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "St. Xavier's School API Server is healthy & operational.",
  });
});

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/academics", academicRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/achievements", achievementRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET must be configured.");
  }
  if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL must be configured in production.");
  }

  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`,
    );
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`[Startup] ${error.message}`);
    process.exit(1);
  });
}

module.exports = app;

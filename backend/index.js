import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.config.js";
import path from "path";
import { fileURLToPath } from "url";

// Create __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Built In Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Serve static files from the "uploads/thumbnails" directory
app.use(
  "/thumbnail",
  express.static(path.join(__dirname, "uploads", "thumbnails"))
);
// Serve static files from the "uploads" directory
app.use(
  "/lesson",
  express.static(path.join(__dirname, "uploads"))
);

// Setup dotenv
dotenv.config({
  path: "./.env",
});

app.get("/", (req, res) => res.json({ message: "Welcome to LMS backend" }));

// routes import
import authRoutes from "./routes/auth.route.js";
import coursesRoutes from "./routes/courses.route.js";
import lessonsRoutes from "./routes/lessons.route.js";
import enrollmentRoutes from "./routes/enrollments.route.js";
import reviewRoutes from "./routes/reviews.route.js";
import categoryRoutes from "./routes/categories.route.js";
import notificationsRoutes from "./routes/notifications.route.js";
import fileRoutes from "./routes/file.route.js";

// routes declaration
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/file", fileRoutes);

// 404 Handler for undefined routes
import { ApiResponse } from "./utils/ApiResponse.js";

app.use((req, res, next) => {
  res.status(404).json(new ApiResponse(404, null, "Invalid Request"));
});

// Error handling
import handleError from "./middleware/errorHandler.middleware.js";

app.use(handleError);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed: ", err);
  });

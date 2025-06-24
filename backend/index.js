import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.config.js";

const app = express();

// Built In Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("uploads"));
app.use(cookieParser());

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

// routes declaration
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed: ", err);
  });

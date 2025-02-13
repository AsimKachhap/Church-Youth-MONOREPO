import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectDB from "./utils/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "https://st-marys-church-youth.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

//ROUTES

import authRoutes from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users/", userRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});

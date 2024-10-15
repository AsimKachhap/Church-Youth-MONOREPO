import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./utils/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://st-marys-church-youth.netlify.app",
    credentials: true,
  })
);

//ROUTES

import authRoutes from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users/", userRoute);
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Backend</h1>");
});
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});

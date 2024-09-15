import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./utils/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(morgan("dev"));

//ROUTES

import authRoutes from "./routes/auth.route.js";

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});

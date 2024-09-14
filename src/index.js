import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./utils/db.js";

const app = express();

dotenv.config();
app.use(morgan("dev"));

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});

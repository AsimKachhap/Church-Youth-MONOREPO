import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

const app = express();

dotenv.config();
app.use(morgan("dev"));

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

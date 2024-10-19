import mongoose from "mongoose";

const bioSchema = new mongoose.Schema({}, { timestamps: true });

const Bio = mongoose.model("Bio", bioSchema);
export default Bio;

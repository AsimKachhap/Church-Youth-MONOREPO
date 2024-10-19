import mongoose from "mongoose";

const introSchema = new mongoose.Schema({}, { timestamps: true });

const Intro = mongoose.model("Intro", introSchema);
export default Intro;

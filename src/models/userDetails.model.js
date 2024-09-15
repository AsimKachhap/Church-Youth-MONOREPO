import mongoose from "mongoose";

const userDetailsSchema = mongoose.Schema({}, { timestamps: true });

export const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

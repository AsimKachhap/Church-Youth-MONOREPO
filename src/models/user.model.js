import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserDetails } from "./userDetails.model.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please give a username"],
      unique: true,
      min: [3, "Username should be altleast 3 characters long."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please add your email."],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide password."],
      min: [6, " Password should be atleast 6 characters long "],
    },

    pofilePhoto: {
      type: String,
      default: "", // Later add a link to default profile photo
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isMember: {
      type: Boolean,
      default: false,
    },

    isDetailsCompelete: {
      type: Boolean,
      default: false,
    },

    userDetails: {
      type: mongoose.Types.ObjectId,
      ref: UserDetails,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

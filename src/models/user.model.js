import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please give a username"],
      min: [3, "Username should be altleast 3 characters long."],
    },

    email: {
      type: String,
      required: [true, "Please add your email."],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isMember: {
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) next();
  try {
    const salt = bcrypt.genSalt(12);
    this.password = bcrypt.hash(this.password, salt);
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

import User from "../models/user.model.js";
import { generateTokens } from "../helpers/generateTokens.helper.js";
import { redis } from "../utils/redis.js";

// REISTER A USER

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ username });
    // This logic doesn't work with User.find() as it returns an empty array instead of null.
    if (!userExists) {
      const user = await User.create({ username, email, password });
      const { accessToken, refreshToken } = await generateTokens(user._id);

      //Set Cookies
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Set Refresh Token
      try {
        await redis.set(`refresh_token:${user._id}`, refreshToken, {
          EX: 7 * 24 * 60 * 60,
        });
      } catch (error) {
        res.status(401).json({
          message: "Failed to store refresh- token in Redis",
          error: error.message,
        });
      }
      res
        .status(201)
        .json({ message: "User created SUCCESSFULLY", data: user });
    } else {
      res
        .status(401)
        .json({ message: "Sorry this username is Already Taken." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong at Server",
      error: error.message,
    });
  }
};

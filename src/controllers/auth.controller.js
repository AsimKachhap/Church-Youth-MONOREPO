import User from "../models/user.model.js";
import { generateTokens } from "../helpers/generateTokens.helper.js";
import { storeRefreshToken } from "../helpers/storeRefreshToken.helper.js";
import { redis } from "../utils/redis.js";
import jwt from "jsonwebtoken";

// REGISTER A USER

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ username });
    // This logic doesn't work with User.find() as it returns an empty array instead of null.
    if (!userExists) {
      const user = await User.create({ username, email, password });
      const { accessToken, refreshToken } = await generateTokens(user._id);

      //Set Cookies
      console.log("Setting Access Token...");
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "None",
        maxAge: 15 * 60 * 1000,
      });

      console.log("Set Access Token :", accessToken);
      console.log("Setting Refresh Token...");
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log("Set Refresh Token :", refreshToken);
      // Set Refresh Token
      try {
        await redis.set(`refresh_token:${user._id}`, refreshToken, {
          EX: 7 * 24 * 60 * 60,
        });
      } catch (error) {
        console.log(error.mesaage);
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
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong at Server",
      error: error.message,
    });
  }
};

//LOGIN

export const login = async (req, res) => {
  console.log("Login cookie:", req.cookies["access-token"]);
  console.log("Full req body: ", req.body);
  const { email, password } = req.body;
  console.log("Email & Password:", email, password);
  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = await generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      //Set Cookies
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "None",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log("Loggin res: ", res);
      res.status(200).json({ message: "Logged in Successfully." });
    } else {
      res.status(401).json({ message: "Email or Password Incorrect." });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
    console.log(error);
  }
};

//LOGOUT
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    await redis.del(`refresh_token:${decoded.userId}`);
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    res.status(200).json({ message: "Logged out Successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//REFRESH ACCESS TOKEN
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh Token not provided." });
    } else {
      const decoded = jwt.decode(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      const storedRefreshToken = await redis.get(
        `refresh_token:${decoded.userId}`
      );
      if (refreshToken === storedRefreshToken) {
        const accessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.cookie("access-token", accessToken),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samesite: "None",
            maxAge: 15 * 60 * 1000,
          };
        res
          .status(201)
          .json({ message: "Access Token refreshed Successfully" });
      } else {
        res.status(401).json({
          message: "Invalid Refresh Token",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong on Server",
      error: error.message,
    });
  }
};

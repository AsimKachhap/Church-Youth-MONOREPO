import { UserDetails } from "../models/userDetails.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import jwt from "jsonwebtoken";

//GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      message: "Successfull fetched all users",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrongg while getting all users.",
      error: error.message,
    });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      message: "Successfully fetched user by Id.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while getting user by Id.",
      error: error.message,
    });
  }
};

// GET MY PROFILE

export const getMyProfile = async (req, res) => {
  try {
    console.log("getMyProfile req:", req);
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
      console.log("Access Token Missing");
      return res.status(401).json({
        message: "Access token missing. Please log in.",
      });
    }

    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            console.log("Token expired");
            return res.status(401).json({
              message: "Access token expired. Please refresh the token.",
            });
          }
          console.log("Invalid Access Token");
          return res.status(401).json({
            message: "Invalid access token. Please log in again.",
          });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          return res.status(404).json({
            message: "User not found.",
          });
        }

        res.status(200).json({
          message: "Successfully fetched User Profile.",
          data: user,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching your profile.",
      error: error.message,
    });
  }
};

// ADDING USER DETAILS
export const addUserDetails = async (req, res) => {
  console.log("Request Body at addUserDetails: ", req.body);

  // Extract fields from req.body
  const {
    firstName,
    middleName,
    lastName,
    fatherName,
    aadhaarNo,
    phoneNo,
    age,
    gender,
    currentAddress,
    churchContribution,
    degree,
    college,
    passingYear,
    jobTitle,
    company,
    location,
    homeParish,
    district,
    state,
    pin,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !fatherName ||
    !phoneNo ||
    !aadhaarNo ||
    !age ||
    !gender ||
    !currentAddress ||
    !churchContribution ||
    !degree ||
    !college ||
    !passingYear ||
    !jobTitle ||
    !company ||
    !location ||
    !homeParish ||
    !district ||
    !state ||
    !pin
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const session = await mongoose.startSession(); // Start session for transaction
  session.startTransaction();
  let transactionCommitted = false; // Track if the transaction has been committed

  try {
    // Upload image to cloud only if it exists
    let photoUrl = "";
    if (req.file) {
      const localFilePath = req.file.path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      photoUrl = uploadResult.url;

      if (!photoUrl) {
        throw new Error("Photo upload failed");
      }
    } else {
      return res.status(400).json({ message: "Photo not provided." });
    }

    // Step 1: Create user details in the database
    const newUserDetails = await UserDetails.create(
      [
        {
          firstName,
          middleName,
          lastName,
          fatherName,
          aadhaarNo,
          phoneNo,
          age: Number(age),
          gender,
          photo: photoUrl,
          currentAddress,
          highestQualification: {
            degree,
            college,
            passingYear,
          },
          jobDetails: {
            jobTitle,
            company,
            location,
          },
          parishInfo: {
            homeParish,
            district,
            state,
            pin,
          },
          churchContribution,
        },
      ],
      { session } // Transaction scope
    );

    // Step 2: Update User with the new UserDetails reference
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        userDetails: newUserDetails[0]._id,
        isDetailsComplete: true,
        profilePhoto: newUserDetails[0].photo, // !!! WARNING !!! db.create({}) returns an Array
      },
      { session, new: true } // Ensure the updated document is returned
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Commit the transaction after all operations succeed
    await session.commitTransaction();
    transactionCommitted = true; // Mark the transaction as committed
    session.endSession(); // End session

    res.status(201).json({
      message: "User details saved successfully",
      data: newUserDetails,
    });
  } catch (error) {
    // Abort the transaction if not yet committed
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    session.endSession(); // Ensure the session is properly ended
    console.error("Transaction failed: ", error);

    res.status(500).json({
      message: "Something went wrong while processing the request.",
      error: error.message,
    });
  }
};

// GET USER DETAILS BY ID

export const getUserDetailsById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.userDetails) {
      return res.status(401).json({
        message: `UserDetails doesn't exist for the User: ${user.username}`,
      });
    } else {
      const userDetails = await UserDetails.findById(user.userDetails);
      res.status(200).json({
        message: "Successfully fetched UserDetails by userId.",
        data: userDetails,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Something went wrong on the server while fetching UserDetails by UserId.",
      error: error.message,
    });
  }
};

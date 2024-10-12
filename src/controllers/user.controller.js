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
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
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
            return res.status(401).json({
              message: "Access token expired. Please refresh the token.",
            });
          }

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
  const {
    firstName,
    middleName,
    lastName,
    phoneNo,
    age,
    gender,
    currentAddress,
    highestQualification,
    jobDetails,
    parishInfo,
    churchContribution,
  } = req.body;

  const degree = highestQualification.degree;
  const college = highestQualification.college;
  const passingYear = highestQualification.passingYear;

  const jobTitle = jobDetails.jobTitle;
  const company = jobDetails.company;
  const location = jobDetails.location;

  const homeParish = parishInfo.homeParish;
  const district = parishInfo.district;
  const state = parishInfo.state;
  const pin = parishInfo.pin;

  const session = await mongoose.startSession(); // Start a session for transaction
  session.startTransaction();

  try {
    if (req.file) {
      const localFilePath = req.file.path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      const photoUrl = uploadResult.url;

      if (photoUrl) {
        // 1. Create user details in the database
        const userDetails = await UserDetails.create(
          [
            {
              firstName,
              middleName,
              lastName,
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
          { session } // Ensure this operation is part of the transaction
        );

        //2. Update the User with new UserDetails
        try {
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              userDetails: userDetails[0]._id,
            },
            {
              session,
              new: true,
            }
          );
        } catch (error) {
          await session.abortTransaction();
          session.endSession();

          res.status(400).json({
            message:
              "Something went wrong while updating User with UserDetails.",
          });
        }

        // Commit the transaction after all operations succeed
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
          message: "User details saved successfully",
          data: userDetails,
        });
      } else {
        // Abort the transaction if image upload fails
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
          message:
            "Something went wrong while uploading the photo to Cloudinary.",
        });
      }
    } else {
      res.status(404).json({ message: "Photo not provided." });
    }
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Something went wrong on the server.",
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

import { UserDetails } from "../models/userDetails.model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

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

  try {
    if (req.file) {
      const localFilePath = req.file.path; // Get the local file path from Multer

      // Upload the photo to Cloudinary
      const uploadResult = await uploadOnCloudinary(localFilePath);

      if (uploadResult && uploadResult.url) {
        const photoUrl = uploadResult.url; // Get the URL of the uploaded image

        const userDetails = await UserDetails.create({
          firstName,
          middleName,
          lastName,
          phoneNo,
          age: Number(age),
          gender,
          photo: photoUrl,
          currentAddress,
          highestQualification: {
            degree: degree,
            college: college,
            passingYear: passingYear,
          },
          jobDetails: {
            jobTitle: jobTitle,
            company: company,
            location: location,
          },
          parishInfo: {
            homeParish: homeParish,
            district: district,
            state: state,
            pin: pin,
          },
          churchContribution,
        });

        res.status(201).json({
          message: "User details saved successfully",
          data: userDetails,
        });
      } else {
        res.status(400).json({
          message: "Failed to upload photo to Cloudinary.",
        });
        console.log("Cloudinary did not return a URL for the uploaded image.");
      }
    } else {
      res.status(404).json({ message: "No photo found in the request." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong on the server.",
      error: error.message,
    });
    console.log(error);
  }
};

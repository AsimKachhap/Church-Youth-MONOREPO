import mongoose from "mongoose";

const userDetailsSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name."],
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name."],
    },

    aadhaarNo: {
      type: String,
      required: [true, "Please provide your 12 digit Aadhaar Number."],
      match: [/^\d{12}$/, "Aadhaar Number must be exactly 12 digits."],
    },
    phoneNo: {
      type: String,
      required: [true, "Please provide your mobile no."],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number."], // Validate 10-digit phone number
    },
    age: {
      type: Number,
      required: true,
      min: [14, "You are too young to join Youth"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Please specify your gender."],
    },
    photo: {
      type: String,
      required: [true, "Photo should be provided"],
    },
    currentAddress: {
      type: String,
      required: [true, "Please provide your current address."],
    },
    highestQualification: {
      degree: {
        type: String,
        required: [true, "Please provide your highest qualification."],
      },
      college: {
        type: String,
        required: [true, "Please provide your college or university."],
      },
      passingYear: {
        type: String,
        required: [true, "Please provide the year of passing."],
        match: [/^[0-9]{4}$/, "Please provide a valid year (e.g., 2020)."], // Validate the year
      },
    },
    jobDetails: {
      jobTitle: {
        type: String,
        required: [true, "Please provide your job title."],
      },
      company: {
        type: String,
        required: [true, "Please provide the company name."],
      },
      location: {
        type: String,
        required: [true, "Please provide the job location."],
      },
    },
    parishInfo: {
      homeParish: {
        type: String,
        required: [true, "Please provide your home parish."],
      },
      district: {
        type: String,
        required: [true, "Please provide the district."],
      },
      state: {
        type: String,
        required: [true, "Please provide your state."],
      },
      pin: {
        type: String,
        required: [true, "Please provide the PIN code."],
        match: [/^[0-9]{6}$/, "Please provide a valid 6-digit PIN code."], // Validate 6-digit PIN code
      },
    },
    churchContribution: {
      type: String,
      required: [
        true,
        "Please describe your contribution or service for the church.",
      ],
      maxlength: [160, "Itna lamba contribution bhi nahi likhna hai."],
    },
  },
  { timestamps: true }
);

export const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

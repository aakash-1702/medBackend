import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Doctor from "../db/models/doctors.models.js";
import { signUpValidation } from "../validations/admininput.validations.js";
import { uploadAtCloudinary } from "../utils/cloudinary.utils.js";
import jwt from "jsonwebtoken";

// -----------lOG IN ADIN
const logInAdmin = asyncHandler(async (req, res) => {
  const token = jwt.sign(
    {
      role: "ADMIN",
      email: process.env.ADMIN_EMAIL,
    },
    process.env.JWT_SECRET
  );

  res.cookie("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res.json(
    new ApiResponse(200, token, "Admin has been loggedIn successfully")
  );
});
// adding the doctor
const addDoctor = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  if (!req.body) {
    throw new ApiError(400, "Please provide the signUp data");
  }
  req.body.address = req.body?.address ? JSON.parse(req.body.address) : {};
  if (!req.file) throw new ApiError(400, "Images can not be empty");
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  } = req.body;
  const imageFile = req.file;
  console.log(typeof address);

  const doctorExists = await Doctor.findOne({
    email,
  });

  if (doctorExists) throw new ApiError(401, "Doctor already exists");
  console.log("Doctor does not exists");

  const inputValidation = signUpValidation.safeParse({
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  });

  if (!inputValidation.success) {
    throw new ApiError(
      400,
      inputValidation.error,
      "there was an error in the input fielsds"
    );
  }

  console.log("Validation was successful");

  let response;

  try {
    response = await uploadAtCloudinary(imageFile.path);
    console.log("File Uploaded successfully");
    if (!response)
      throw new ApiError(401, "Unable to upload at cloudinary at this moment");
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error, "Something went wrong");
  }

  console.log(response);

  try {
    const newUser = await Doctor.create({
      name,
      email,
      password,
      image: response.secure_url,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    });
    const doctorAdded = await Doctor.find({
      email,
    }).select("--password");
    return res
      .status(201)
      .json(
        new ApiResponse(201, doctorAdded, "Doctor has been added to the db")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Unable to add doctor to the database");
  }
});

const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const allDoctors = await Doctor.find().select("-password");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allDoctors,
          "All Doctors data retrieved successfully"
        )
      );
  } catch (e) {
    console.log(error);
    throw new ApiError(401, "Something went wrong");
  }
});

const changeAvailablity = asyncHandler(async (req, res) => {
  try {
    const _id = req.params._id;
    const doctor = await Doctor.findByIdAndUpdate(
      _id,
      [{ $set: { available: { $not: "$available" } } }], // for changing or swapping true with false and vice-versa , in just one operation without pre fetching of the available status
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Availability updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      401,
      error,
      "Error while updating the availability status"
    );
  }
});

export { addDoctor, logInAdmin, getAllDoctors, changeAvailablity };

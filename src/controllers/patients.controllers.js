import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Patient from "../db/models/patients.models.js";
import Doctor from "../db/models/doctors.models.js";
import { uploadAtCloudinary } from "../utils/cloudinary.utils.js";

const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const allDoctors = await Doctor.find().select(["-password", "-email"]);
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

const createPatient = asyncHandler(async (req, res) => {
  if (!req.body) throw new ApiError(400, "Please provide the input fields");
  const { name, email, password, address, gender, phone, dob } = req.body;

  if (!req.file) throw new ApiError(400, "Please provide the profile photo");
  const profilePhoto = req.file;
  console.log(profilePhoto);

  // uploading at the cloud
  try {
    const imageResponse = await uploadAtCloudinary(profilePhoto.path);
    const patient = await Patient.create({
      name , email , password ,image : imageResponse.secure_url, address : JSON.parse(address),gender,dob,phone
    });

    return res.status(201).json(new ApiResponse(201,patient,"Patient's profile created successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(401,"Something went wrong");
  }
});

export { getAllDoctors, createPatient };

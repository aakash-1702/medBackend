import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Patient from "../db/models/patients.models.js";
import Doctor from "../db/models/doctors.models.js";
import { uploadAtCloudinary } from "../utils/cloudinary.utils.js";
import jwt from "jsonwebtoken";
import Appointment from "../db/models/appointments.models.js";

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
  const patientExists = await Patient.findOne({ email });
  if (patientExists) throw new ApiError(401, "Patient already exists");

  if (!req.file) throw new ApiError(400, "Please provide the profile photo");
  const profilePhoto = req.file;
  console.log(profilePhoto);

  // uploading at the cloud
  try {
    const imageResponse = await uploadAtCloudinary(profilePhoto.path);
    const patient = await Patient.create({
      name,
      email,
      password,
      image: imageResponse.secure_url,
      address: JSON.parse(address),
      gender,
      dob,
      phone,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, patient, "Patient's profile created successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Something went wrong");
  }
});

const logInPatient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  const patientExists = await Patient.findOne({ email }).select("+password");
  console.log(patientExists);
  if (!patientExists) throw new ApiError(401, "Please SignUp first");
  console.log("About to compare the password");

  const correctPassword = await patientExists.isPasswordCorrect(password);
  if (!correctPassword)
    throw new ApiError(401, "Entered email or password is wrong");

  const token = jwt.sign(
    {
      role: "PATIENT",
      email: email,
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.cookie("patientAuth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, patientExists, "LoggedIn Successfully"));
});

const profileData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patientExists = await Patient.findById({
    _id: id,
  });
  if (!patientExists)
    throw new ApiError(401, "Something went wrong while fetching profile data");
  return res
    .status(200)
    .json(
      new ApiResponse(200, patientExists, "Profile Data fetched successfully")
    );
});

const updateProfileData = asyncHandler(async (req, res) => {
  // we have skipped email here , cause email is verified for every user , so changing it would make the authentication system break
  // we have also not allowed the feature to update dob
  const { id } = req.params;
  const { name, password, address, gender } = req.body;
  const profilePhoto = req.file;
  const newPatientData = await Patient.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      name,
      address,
      gender,
    },
    { new: true }
  );
  newPatientData.password = password;
  const updatedProfile = newPatientData.save();
  if (!newPatientData)
    throw new ApiError(401, "Unable to update the profile at the moment");

  if (profilePhoto) {
    const updatePhoto = await uploadAtCloudinary(profilePhoto.path);
    if (!updatePhoto)
      throw new ApiError(401, "Unable to upload at cloudinary at the moment");
  }

  return res
    .status(203)
    .json(
      new ApiResponse(203, newPatientData, "Profile Updated Successfullyy")
    );
});

const bookAppointement = asyncHandler(async (req, res) => {
  console.log('Request reached appointment');
  const patientId = req.params.id;
  console.log(patientId);
  console.log(req.body);
  const { docId, slotDate, slotTime } = req.body;

  const docData = await Doctor.findById(docId).select("-password");
  if (!docData)
    throw new ApiError(401, "Unable to fetch doc Data at this moment");

  const slots_booked = docData.slots_booked;

  // checking if the doctor is available or not
  if (!docData.available) {
    return res
      .status(300)
      .json(
        new ApiResponse(
          300,
          "Doctor Unavailable",
          "Unable to book the meeting at the moment"
        )
      );
  }

  const slotNum = Number(slotTime);

  // checking if the slotDate and slotTime  is available or not
  if (slots_booked[slotDate]) {
    if (slots_booked[slotDate].includes(slotNum)) {
      return res
        .status(300)
        .json(
          new ApiResponse(
            300,
            "Doctor Unavailable",
            "Please look for different slots"
          )
        );
    } else {
      slots_booked[slotDate].push(slotNum);
    }
  } else {
    slots_booked[slotDate] = [];
    slots_booked[slotDate].push(slotNum);
  }

  delete docData.slots_booked;

  const updatedDoctor = await  Doctor.findByIdAndUpdate(
    docId,
    {
      slots_booked,
    },
    { new: true }
  );
  await updatedDoctor.save();

  const userData = await Patient.findById(patientId).select("-password");
  if (!userData)
    throw new ApiError(401, "Unable to fetch the patientData at this moment");

  const appointmentBooked = await Appointment.create({
    patientId: patientId,
    docId: docId,
    slotDate,
    slotTime,
    userData,
    docData,
    amount: docData.fees,
    date: Date.now(),
  });
  if(!appointmentBooked) throw new ApiError(401,"Unable to process appointment at the moment");
  return res.status(201).json(new ApiResponse(201,appointmentBooked,"Appointment booked successfully"));
});

export {
  getAllDoctors,
  createPatient,
  logInPatient,
  profileData,
  updateProfileData,
  bookAppointement,
};

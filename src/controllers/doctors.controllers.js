import jwt from 'jsonwebtoken';
import Doctor from '../db/models/doctors.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import Appointment from '../db/models/appointments.models.js';


const logInDoctor = asyncHandler(async (req,res) => {
    const {email , password} = req.body;
    const doctorExists = await Doctor.findOne({
        email
    });
    if(!doctorExists) throw new ApiError(401,"Invalid email or password");
    const correctPassword = await doctorExists.isPasswordCorrect(password);
    if(!correctPassword) throw new ApiError(401,"Invalid email or password");
    
    const doctorToken = jwt.sign({
        role : "DOCTOR",
        email : email
    },process.env.JWT_SECRET);
    console.log(doctorToken);

    res.cookie("auth",doctorToken,{
        http:true,
        secure : process.env.NODE_ENV === "production"
    });

    return res.status(200).json(new ApiResponse(200,doctorExists,"Doctor logIn was successfull"));
});


const changeAvailablity = asyncHandler(async (req, res) => {
  try {
    const _id = req.params;
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


const getMyAppointments = asyncHandler(async (req,res) => {
  const docId = req.params.id;
  const myAppointments = await Appointment.find({
    docId,
    cancelled : false
  });
  if(!myAppointments) throw new ApiError(401,"Unable to load the appointments at this moment");

  return res.status(200).json(new ApiResponse(200,myAppointments,"Your appointments"));

});
export {logInDoctor , changeAvailablity , getMyAppointments};
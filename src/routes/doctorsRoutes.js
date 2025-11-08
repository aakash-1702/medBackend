import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logInDoctor , changeAvailablity } from '../controllers/doctors.controllers.js';
import { Router } from 'express';
import { doctorValidation } from '../middlewares/doctor.middlewares.js';
const doctorRouter = Router();

// -----------DOCTOR LOGIN ROUTE
doctorRouter.post('/logIn',logInDoctor); 

// --------- DOCTOR'S PERSONAL OPERATIONS
doctorRouter.patch('/updateAvailability/:_id',doctorValidation,changeAvailablity);

export default doctorRouter;
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from '../utils/asyncHandler.js';
// adding the doctor
const addDoctor = asyncHandler(async (req,res)=>{
    const { name , email , password , speciality , degree , experience , about , fees, address } = req.body;

});


export {addDoctor};
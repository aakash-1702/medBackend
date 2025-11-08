import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
const doctorValidation = async (req, res, next) => {
    const authToken = req.cookies?.auth? req.cookies.auth : null;
    if(!authToken) throw new ApiError(401,"Please logIn as doctor");

    try {
         const decodedToken = jwt.verify(authToken,process.env.JWT_SECRET); 
         if(decodedToken.role === "DOCTOR") return next();         
           
    } catch (error) {       
          throw new ApiError(401,"Please logIn as doctor");
          
    }
};

export { doctorValidation };

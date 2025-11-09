import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
const patientValidation = async (req, res, next) => {
    
    const patientAuth = req.cookies?.patientAuth? req.cookies.patientAuth : null;
    if(!patientAuth) throw new ApiError(401,"Please logIn as patient");

    try {
         const decodedToken = jwt.verify(patientAuth,process.env.ACCESS_TOKEN_SECRET);
         console.log("Verification was successfull"); 
         
         if(decodedToken.role === "PATIENT") return next();         
           
    } catch (error) {      
          console.log(error); 
          throw new ApiError(401,"Please logIn as patient");
          
    }
};

export { patientValidation };

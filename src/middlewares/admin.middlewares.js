import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
const adminValidation = async (req, res, next) => {
    const authToken = req.cookies?.auth? req.cookies.auth : null;
    if(!authToken) throw new ApiError(401,"Please logIn as admin");

    try {
         const decodedToken = jwt.verify(authToken,process.env.JWT_SECRET); 
         if(decodedToken.role === "ADMIN") return next();         
           
    } catch (error) {       
          throw new ApiError(401,"Please logIn as admin");
          
    }
};

export { adminValidation };

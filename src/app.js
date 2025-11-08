import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiResponse } from "./utils/apiResponse.js";
import adminRouter from "./routes/adminRoutes.js";


// ----------------------- configuration for express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// -----------------basic endpoint for mediguide
app.get('/mediguide/api/v1/healthCheck',(req,res)=> {
    return res.status(200).json(new ApiResponse(200,"OK","Server Started successfully"));
})
app.use("/mediguide/api/v1/doctors",adminRouter);

export { app };

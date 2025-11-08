import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiResponse } from "./utils/apiResponse.js";
import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorsRoutes.js";
import patientRouter from "./routes/patientRoutes.js"
// localhost port 3173 


// ----------------------- configuration for express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/public", express.static("public"));

// -----------------basic endpoint for mediguide
app.get('/mediguide/api/v1/healthCheck',(req,res)=> {
    return res.status(200).json(new ApiResponse(200,"OK","Server Started successfully"));
})

// ------ ADMIN ROUTES

app.use("/mediguide/api/v1/admin",adminRouter);


// ---------------- DOCTOR ROUTES
app.use("/mediguide/api/v1/doctor",doctorRouter);

// ------------PATIENT ROUTES
app.use("/mediguide/api/v1/patient",patientRouter);

export { app };

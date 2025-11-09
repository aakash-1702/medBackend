import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addDoctor , logInAdmin , getAllDoctors , changeAvailablity , getAllAppointments , getDashboardData} from "../controllers/admin.controllers.js";
const adminRouter = express.Router();
import { adminValidation } from "../middlewares/admin.middlewares.js";


// --------------------ADMIN LOGIN AND LOGOUT
adminRouter.post('/logIn',logInAdmin);

//// ------------ related to the doctor
adminRouter.post('/addDoctor',adminValidation,upload.single("imageFile"),adminValidation,addDoctor);
adminRouter.get('/allDoctors',adminValidation,getAllDoctors);
adminRouter.patch('/updateAvailability/:_id',adminValidation,changeAvailablity);

/// ------------related to the appointments
adminRouter.get('/allAppointments',adminValidation,getAllAppointments);

/// ------ admin dashboard 
// here we fetch top 5 newest appointments and total no of doctors and total no of patients
adminRouter.get('/dashboardData',adminValidation,getDashboardData);

export default adminRouter;

import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addDoctor , logInAdmin } from "../controllers/admin.controllers.js";
const adminRouter = express.Router();
import { adminValidation } from "../middlewares/admin.middlewares.js";


// --------------------ADMIN LOGIN AND LOGOUT
adminRouter.post('/logIn',logInAdmin);

//// ------------ related to the doctor
adminRouter.post('/addDoctor',adminValidation,upload.single("imageFile"),adminValidation,addDoctor);

export default adminRouter;

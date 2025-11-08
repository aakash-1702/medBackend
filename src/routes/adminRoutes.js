import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addDoctor } from "../controllers/admin.controllers.js";
const adminRouter = express.Router();
import { adminValidation } from "../middlewares/admin.middlewares.js";


adminRouter.post('/addDoctor',upload.single("imageFile"),adminValidation,addDoctor);

export default adminRouter;

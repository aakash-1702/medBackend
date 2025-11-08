import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addDoctor } from "../controllers/admin.controllers.js";
const adminRouter = express.Router();

adminRouter.post('/addDoctor',upload.single('image'),addDoctor);

export default adminRouter;

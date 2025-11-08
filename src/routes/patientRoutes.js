import {Router} from 'express';
const patientRouter = Router();
import { getAllDoctors , createPatient } from '../controllers/patients.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';


// ------- NON SIGNED UP USER ACTIONS
// -- get the list of all doctors
patientRouter.get('/allDoctors',getAllDoctors);

// ----- SIGNUP AND LOGIN FOR PATIENT
patientRouter.post('/signUp',upload.single("profilePhoto"),createPatient);




export default patientRouter;
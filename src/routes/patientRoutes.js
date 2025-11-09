import {Router} from 'express';
const patientRouter = Router();
import { getAllDoctors , createPatient , logInPatient, profileData , updateProfileData , bookAppointement} from '../controllers/patients.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { patientValidation } from '../middlewares/patient.middlewares.js';


// ------- NON SIGNED UP USER ACTIONS
// -- get the list of all doctors
patientRouter.get('/allDoctors',getAllDoctors);

// ----- SIGNUP AND LOGIN FOR PATIENT
patientRouter.post('/signUp',upload.single("profilePhoto"),createPatient);
patientRouter.post('/logIn',logInPatient)

// ------- PROFILE AND UPDATION OF PROFILE
patientRouter.get('/myProfile/:id',patientValidation,profileData);
patientRouter.post('/updateProfile/:id',patientValidation,upload.single("profilePhoto"),updateProfileData);


// ----------- APPOINTMENT BOOKING AND CANCELLATION FEATURES
// for adding an appointment , we are just taking the doctorId and and date and time for which patient wants to visit the doctor
patientRouter.post('/bookAppointement/:id',patientValidation,bookAppointement);




export default patientRouter;
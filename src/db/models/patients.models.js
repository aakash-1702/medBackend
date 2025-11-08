import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // don't return by default for security
    },

    image: {
      type: String,      
      default : "public/assests/patients.jpg"
    } , 

    address: {
      type: Object,
      required: [true, "Address is required"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"]      
    },

    dob: {
      type: Date, // or use Date if you want actual date comparison
      required : true
    },

    phone: {
      type: Number,
      
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

patientSchema.pre("save",async function(next){
    if(!this.isModified("password")) next();

    const hashedPassword = await bcrypt.hash(this.password,12);
    this.password = hashedPassword;
    next();
});


const Patient = mongoose.model("Patient",patientSchema,"patient");

export default Patient;





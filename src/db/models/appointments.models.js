import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // assuming you have a Patient model
      required: [true, "Patient ID is required"],
    },

    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // assuming you have a Doctor model
      required: [true, "Doctor ID is required"],
    },

    slotDate: {
      type: Date,
      required: [true, "Appointment date (slotDate) is required"],
    },

    slotTime: {
      type: String, // could be something like 930 for 9:30 AM, or a timestamp
      required: [true, "Appointment time (slotTime) is required"],
    },

    userData: {
      type: Object,
      required: [true, "Patient details (userData) are required"],
    },

    docData: {
      type: Object,
      required: [true, "Doctor details (docData) are required"],
    },

    amount: {
      type: Number,
      required: [true, "Appointment amount is required"],
    },

    payment: {
      type: Boolean,
      default: false,
    },
    
    date : {
        type : Date,
        required : true
    },

    cancelled: {
      type: Boolean,
      default: false,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema,"appointments");

export default Appointment;

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index : true
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    date: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
    slots_booked: {
      type: Object,
      default: {},
    },
  },
  {
    minimize: false, // ✅ keeps empty objects like slots_booked: {}
    timestamps: true, // optional, adds createdAt & updatedAt
  }
);

// -----------------------------pre hoooks on the data
doctorSchema.pre("save",async function(next){
    if(!this.isModified("password")) next();

    const hashedPassword  = await bcrypt(this.password,12);
    console.log("Password has been hashed",hashedPassword);
    this.password = hashedPassword;
    next();
});



// ----- methods on the data
doctorSchema.method.isPasswordCorrect = async function(password){
    const isCorrect = await bcrypt.compare(password,this.password);// return bool value
    return isCorrect;
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id : this._id
  },process.env.ACCESS_TOKEN_SECRET,{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
  });
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id : this._id
  },process.env.REFRESH_TOKEN_SECRET,{
    expiresIn : process.env.REFRESH_TOKEN_EXPIRY
  });
}


const Doctor = mongoose.model("Doctor", doctorSchema,"doctors");

export default Doctor;


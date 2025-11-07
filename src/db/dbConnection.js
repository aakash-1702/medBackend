import mongoose from "mongoose";

const connectDb = async () => {
  await mongoose
    .connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`)
    .then(() => {
      console.log("MongoDB has been connected successfully");
    })
    .catch((e) => console.log("error has occured",e));
};

export { connectDb };

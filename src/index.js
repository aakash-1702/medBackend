import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
  path: "./src/.env",
});
import { connectDb } from "./db/dbConnection.js";



const PORT = process.env.PORT || 3000;
connectDb().then(() => {
  app.listen(PORT, () =>
    console.log(`Server started at http://localhost:${PORT}`)
  );
}).catch((e) => {
    console.log("error occured establishing server connection",e);
});

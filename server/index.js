const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary =require("cloudinary");
const app = express();
const authRoutes = require("./routes/auth");
const imagesRoutes=require("./routes/images");
require("dotenv").config();
const users = require("./models/userModel");
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));




mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
})
  

app.use("/api/auth", authRoutes);
app.use("/api/images",imagesRoutes);




const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

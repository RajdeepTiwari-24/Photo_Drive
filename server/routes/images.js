const express = require("express");
const multer = require("multer");
const path = require("path");
const users = require("../models/userModel");
const getDataUri = require("../utils/DataUri.js");
const router = require("express").Router();
const cloudinary= require("cloudinary");


const storage= multer.memoryStorage();

const singleUpload =multer ({storage}).single("file");


router.post("/upload", singleUpload, async (req, res) => {
    const userId = req.body.userid;
    const file = req.file;
    const fileuri=getDataUri(file);
    const mycloud= await cloudinary.v2.uploader.upload(fileuri.content);
    users
      .findOneAndUpdate(
        { _id: userId }, 
        { $push: { images: mycloud.secure_url } }, 
        { new: true }
      )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        console.log(user.images);
        res.json({ image: file, userId: userId });
      })
      .catch((err) => res.status(500).json({ error: "Internal server error" }));
    //return res.status(200).json({ msg: "All Good" });
  });
  
 router.get("/getImage", (req, res) => {
    const userId = req.query.userid;
    users
      .findOne({ _id: userId }) 
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        const imageList = user.images.map((image) => ({
          image: image,
          _id: image._id,
        }));
  
        res.json(imageList);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  
  router.post("/deleteImage", async (req, res) => {
    try {
      console.log("Delete Route");
      const userId = req.body.userid;
      const imageName = req.body.imagename;
      const user = await users.findById(userId);
      const parts = imageName.split("/");
      const publicIdWithExtension = parts.pop(); // Get the last part of the URL
      const publicId = publicIdWithExtension.split(".")[0]; // Remove the extension
      console.log(publicId);
      const deleteresult= await cloudinary.v2.uploader.destroy(publicId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.images = user.images.filter(image => image !== imageName);
      await user.save();
      res.status(200).json({ message: "Image deleted successfully" });
      //return res.status(200).json({ message: "All Good" })
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

  module.exports = router;

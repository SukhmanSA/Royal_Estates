const express = require("express");
const userControllers = require("../controllers/user-controllers");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: 'dvc4gqmgo', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: "KQwPb-CEyZ5O6EGnpmCYcXWlUVQ",
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "mern-images",
        allowed_formats: ["jpeg", "jpg", "png"],
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/signup", upload.single("image"), userControllers.signup);

router.post("/login", userControllers.login);

router.post("/google", upload.single("image"), userControllers.otherOptions);

router.patch("/update-user/:uid", upload.single("image"), userControllers.updateUser)

router.delete("/delete-user/:uid", upload.single("image"), userControllers.deleteUserById)

module.exports = router;

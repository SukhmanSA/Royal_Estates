const express = require("express");
const router = express.Router()
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dvc4gqmgo', 
    api_key: '357136346272646', 
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
const estateControllers = require("../controllers/estates-controllers")

router.post("/create-estate", upload.array("imageUrls", 6), estateControllers.createEstate)

router.get("/get-estates/:uid",  estateControllers.getEstatesByUserId)

router.get("/",  estateControllers.getAllEstates)

router.get("/get-estate/:eid",  estateControllers.getEstateById)

router.patch("/updateById/:eid", upload.array("imageUrls", 6),estateControllers.updateEstateById)

router.delete("/deleteById/:eid", estateControllers.deleteEstateListingById)

module.exports = router;
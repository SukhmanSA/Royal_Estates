const Estate = require("../models/estate")
const HttpError = require("../models/http-error")
const cloudinary = require("cloudinary").v2;

const createEstate = async(req, res, next) => {

    const { name, address, description,regularPrice,
    discountPrice,
    bedrooms,
    bathrooms,
    furnished,
    parking,
    type,
    offer,
    userRef } = req.body

    if (!req.files || req.files.length === 0) {
        return next(new HttpError('You must upload at least one image', 400));
      }
    
      console.log(type)

      const imageUrls1 = req.files.map((file) => file.path)

    let estate;
    try{
        estate = new Estate({
     name, address, description,regularPrice,
    discountPrice,
    bedrooms,
    bathrooms,
    furnished,
    parking,
    type,
    offer,
    imageUrls: imageUrls1,
    userRef
        })
    }catch(err){
        return next(new HttpError("Could not create estate",404))
    }

    try{
        await estate.save()
    }catch(err){
        return next(new HttpError("Could not create estate",500))
    }

    console.log("estate type:", estate.type)

    res.status(200).json(estate)

}

const getEstateById = async(req, res, next) => {
  const estateId = req.params.eid;
  let estate;
  try {
    estate = await Estate.findById(estateId);
  } catch (err) {
    return next(new HttpError("Fetching estates failed, please try again later.", 500));
  }
  res.status(200).json(estate);
}

const getEstatesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
  
    let estates;
    try {
      estates = await Estate.find({ userRef: userId });
      if (!estates || estates.length === 0) {
        return next(new HttpError("No estates found for this user.", 400));
      }
    } catch (err) {
      return next(new HttpError("Fetching estates failed, please try again later.", 500));
    }
    res.status(200).json(estates);
  };

  cloudinary.config({
    cloud_name: 'dvc4gqmgo', 
    api_key: '357136346272646', 
    api_secret: "KQwPb-CEyZ5O6EGnpmCYcXWlUVQ",
});
  

  const deleteEstateListingById = async (req, res, next) => {
    const estateId = req.params.eid;
  
    let estate;
    try {
      estate = await Estate.findById(estateId);
      if (!estate) {
        return next(new HttpError("Estate not found.", 404));
      }
    } catch (err) {
      return next(new HttpError("Deleting estate failed, please try again later.", 500));
    }
  
    const images = estate.imageUrls || [];
  
    try {
      await Estate.findByIdAndDelete(estateId);
    } catch (err) {
      return next(new HttpError("Deleting estate failed, please try again later.", 500));
    }
  
    for (const imageUrl of images) {
      const publicId = imageUrl
        .split('/image/upload/')[1]
        .split('/').slice(1).join('/')
        .split('.')[0];
  
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted image:", publicId, "Response:", result);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
  
    res.status(200).json({ message: "Successfully deleted estate and all its images!" });
  };

  const updateEstateById = async (req, res, next) => {
    const estateId = req.params.eid;
    const {
      name,
      address,
      description,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      type,
      offer,
    } = req.body;
  
    let estate;
    try {
      estate = await Estate.findById(estateId);
      if (!estate) {
        return next(new HttpError("Estate not found.", 404));
      }
    } catch (err) {
      return next(new HttpError("Fetching estate failed, please try again later.", 500));
    }
  
    const newImageUrls = req.files?.map((file) => file.path);

    estate.name = name;
    estate.address = address;
    estate.description = description;
    estate.regularPrice = regularPrice;
    estate.discountPrice = discountPrice;
    estate.bedrooms = bedrooms;
    estate.bathrooms = bathrooms;
    estate.furnished = furnished;
    estate.parking = parking;
    estate.type = type;
    estate.offer = offer;
    if (newImageUrls && newImageUrls.length > 0) {
      estate.imageUrls = [...newImageUrls];
  }
  
    try {
      await estate.save();
    } catch (err) {
      return next(new HttpError("Updating estate failed, please try again.", 500));
    }

  
    res.status(200).json({ estate });
  };


  const getAllEstates = async (req, res, next) => {
    let estates;
    try {
      estates = await Estate.find({}, "name address description regularPrice discountPrice bedrooms bathrooms furnished parking type offer imageUrls userRef");
    } catch (err) {
      return next(
        new HttpError("Could not fetch users, please try again later"),
        500
      );
    }
  
    res.status(201).json(estates);
  };
  
  
exports.createEstate = createEstate
exports.getEstatesByUserId = getEstatesByUserId
exports.deleteEstateListingById = deleteEstateListingById 
exports.updateEstateById = updateEstateById
exports.getEstateById = getEstateById
exports.getAllEstates = getAllEstates
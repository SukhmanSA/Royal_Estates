const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require('cloudinary').v2;

const User = require("../models/user")
const Estate = require("../models/estate")
const HttpError = require("../models/http-error")
 
const signup = async(req, res, next)=>{

    const { email, username, password } = req.body

    let existingUser;
    try{
        existingUser = await User.findOne({ email: email })
    }catch(err){
        return next(new HttpError("Could not Signup, please try again later", 500));
    }

    if(existingUser){
        return next(new HttpError("A user with this email exists, please enter another email.", 401));
    }

    let hashedPassword;
    try{
        hashedPassword = await bycrypt.hash(password,12) 
    }catch(err){
        return next(new HttpError("Could not Signup, please try again later", 500));     
    }

    let createdUser;
    if(!existingUser){
        createdUser = new User({
            email,
            username,
            image: req.file.path, 
            password: hashedPassword,
            googleAuth: false
        })
    }

    try {
        await createdUser.save();
      } catch (err) {
        return next(new HttpError("Could not Signup, please try again later"), 500);
      }

      let token;
      try{
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            "super_secret_key",
            { expiresIn: "1h" }
        )
    }catch(err){
        return next(new HttpError("Could not Signup, please try again later", 500));     
    }

    res.cookie("token",token,{
        httpOnly: false,
        secure: false, 
        sameSite: "lax", 
        path: "/",
        maxAge: 3 * 60 * 60 * 1000,
      })
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token , image: createdUser.image, username });

}

const login = async(req, res, next) =>{
    const { email, password } = req.body
    
    let identifiedUser
    try{
        identifiedUser = await User.findOne({ email: email })
    }catch(err){
        return next(new HttpError("Could not Login, please try again later", 500));    
    }

    if(!identifiedUser){
        return next(new HttpError("Invalid credentials, login failed.", 500));    
    }

    let isValidPassword = false;
    try {
      isValidPassword = bycrypt.compare(password, identifiedUser.password);
    } catch (err) {
      return next(new HttpError("Invalid credentials, login failed.", 500));
    }
  
    if (!isValidPassword) {
      return next(new HttpError("Invalid credentials, login failed.", 401));
    }

    let token;
    try{
        token = jwt.sign(
            { userId:identifiedUser.id, email:identifiedUser.email },
            "super_secret_key",
            { expiresIn: "1h"  }
        )
    }catch(err){
        return next(new HttpError("Could not Login, please try again later", 500));    
    }
  

    res.cookie("token",token,{
        httpOnly: false,
        secure: false, 
        sameSite: "lax", 
        path: "/",
        maxAge: 3 * 60 * 60 * 1000,
      }).status(200).json({
        userId: identifiedUser.id,
        email: identifiedUser.email,
        username:identifiedUser.username,
        image: identifiedUser.image,
        token: token
      });

}

const otherOptions = async (req, res, next) => {
  const { username, email, photo } = req.body;

  const imagePath = req.file ? req.file.path : photo;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Could not log in. Please try again later.", 500));
  }

  if (!identifiedUser) {
    const createdUser = new User({
      username,
      email,
      image: imagePath,
      googleAuth: true,
    });

    try {
      await createdUser.save();
      identifiedUser = createdUser;
    } catch (err) {
      return next(new HttpError("Could not sign up. Please try again later.", 500));
    }
  } else if (req.file) {
    identifiedUser.image = imagePath;
    await identifiedUser.save();
  }

  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      "super_secret_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Could not log in. Please try again later.", 500));
  }

  res
    .cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 3 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      userId: identifiedUser.id,
      username: identifiedUser.username,
      email: identifiedUser.email,
      image: identifiedUser.image,
      token,
    });
};


cloudinary.config({
  cloud_name: 'dvc4gqmgo', 
  api_key: '357136346272646', 
  api_secret: "KQwPb-CEyZ5O6EGnpmCYcXWlUVQ"
});

const updateUser = async (req, res, next) => {
  const { username, email } = req.body;
  const userId = req.params.uid;

  let updatedUser;
  try {
    updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return next(new HttpError("User not found.", 404));
    }
  } catch (err) {
    return next(new HttpError("Could not fetch the user. Please try again.", 500));
  }

  updatedUser.username = username || updatedUser.username;
  updatedUser.email = email || updatedUser.email;

  const prevImage = updatedUser.image.slice(8,11);

  if (req.file && prevImage !== "lh3" && prevImage !== "ava") {
    if (updatedUser.image) {
      const publicId = updatedUser.image
        .split('/image/upload/')[1]
        .split('/').slice(1).join('/')
        .split('.')[0];

      console.log("Extracted publicId:", publicId);

      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Response:", result);
      } catch (err) {
        console.error("Error deleting old image from Cloudinary:", err);
        return next(new HttpError("Could not delete the old image. Please try again later.", 500));
      }
    }

    updatedUser.image = req.file.path;
  }

  if(req.file && prevImage === "lh3" || prevImage === "ava"){
    updatedUser.image = req.file.path;
  }


  let token;
  try {
    token = jwt.sign(
      { userId, email: updatedUser.email },
      "super_secret_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Could not log in. Please try again later.", 500));
  }

  try {
    await updatedUser.save();
  } catch (err) {
    return next(new HttpError("Could not update the user. Please try again later.", 500));
  }

  res
    .cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 3 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      userId,
      username: updatedUser.username,
      email: updatedUser.email,
      image: updatedUser.image,
      token,
    });
};


const deleteUserById = async(req, res, next) => {

    const userId = req.params.uid

    let deletedUser;
    try {
      deletedUser = await User.findById(userId);
      if (!deletedUser) {
        return next(new HttpError("User not found.", 404));
      }
    } catch (err) {
      return next(new HttpError("Could not fetch the user. Please try again.", 500));
    }

    try{
        await Estate.deleteMany({ userRef: userId })
    }catch(err){
      return next(new HttpError("Could not delete the user. Please try again.", 500));
    }
    
    try{
     await User.deleteOne({ _id: userId })
     res.clearCookie('token');
    }catch(err){
      return next(new HttpError("Could not delete user. Please try again later.", 500));      
    }
    const googleImage = deletedUser.image.slice(8,11);
    if(googleImage !== "lh3" && googleImage !=="ava"){
      const publicId = deletedUser.image
    .split('/image/upload/')[1]
    .split('/').slice(1).join('/')
    .split('.')[0];

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary Response:", result);
  } catch (err) {
    console.error("Error deleting old image from Cloudinary:", err);
    return next(new HttpError("Could not delete the old image. Please try again later.", 500));
  }

    }

  res.status(200).json({message: "User Deleted Successfully!"})

}


exports.signup = signup
exports.login = login
exports.otherOptions = otherOptions
exports.updateUser = updateUser
exports.deleteUserById = deleteUserById
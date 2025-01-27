const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user-routes")
const estateRoutes = require("./routes/estates-routes")
const HttpError = require("./models/http-error")

require('dotenv').config();

const app = express();

app.use(bodyParser.json());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users", userRoutes)

app.use("/api/estates", estateRoutes)

app.use((req, res, next)=>{
    return next(new HttpError("No Route was found",404))
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.connect(
    process.env.MONGODB_URL
).then(()=>{
    app.listen(5000)
    console.log("connected to mongodb!")
}).catch(err=>{
    console.log(err)
})

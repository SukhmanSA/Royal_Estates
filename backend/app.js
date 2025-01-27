const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user-routes")
const estateRoutes = require("./routes/estates-routes")
const HttpError = require("./models/http-error")

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
    "mongodb+srv://sukhmanwebdev:Harpreet%4022@estate-cluster.hukd4.mongodb.net/?retryWrites=true&w=majority&appName=estate-cluster"
).then(()=>{
    app.listen(5000)
    console.log("connected to mongodb!")
}).catch(err=>{
    console.log(err)
})

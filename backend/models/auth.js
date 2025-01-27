const jwt = require("jsonwebtoken")
const HttpError = require("./http-error")

const auth = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'Unauthorized'));
  
    jwt.verify(token, "super_secret_key", (err, user) => {
      if (err) return next(new HttpError("Forbidden", 403));
  
      req.user = user;
      next();
    });

}

module.exports = auth
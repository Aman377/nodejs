const jwt = require('jsonwebtoken');
require('dotenv').config();
const statusCode = require("../helpers/statusCode")


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(statusCode.UNAUTHORIZED).json({
      status: statusCode.UNAUTHORIZED,
      message: 'Unauthorized!',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, "secret");
    req.user = user;
    next();
  } catch (error) {
    res.status(statusCode.FORBIDDEN).json({
      status: statusCode.FORBIDDEN,
      message: 'Invalid token provide',
    });
  }
};
module.exports = verifyToken;

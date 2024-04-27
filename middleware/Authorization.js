const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized!',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, "secret");
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      status: 403,
      message: 'Invalid token provide',
    });
  }
};
module.exports = verifyToken;

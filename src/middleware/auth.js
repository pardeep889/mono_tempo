// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = "TEST_SECRET_KEY";
const refreshTokenSecretKey = "TEST_REFRESH_SECRET_KEY";


exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access Denied | Token not Provided",
      data: null
    });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({
      success: false,
      message: "Provided Token is not Valid/Expired",
      data: null
    });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access Denied' });
    }
    next();
  };
};

exports.verifyRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Access Denied | Refresh Token not Provided",
      data: null
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey);
    req.user = decoded;
    req.jti = decoded.jti;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Provided Refresh Token is not Valid/Expired",
      data: null
    });
  }
};

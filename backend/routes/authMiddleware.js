const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  // Extract token (expecting "Bearer <token>")
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to request object for protected routes
    req.user = { userId: decoded.userId };
    
    // Proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

module.exports = authMiddleware;
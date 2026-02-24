import jwt from 'jsonwebtoken';
import User from '../User/UserModel.js';

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token is required',
        data: null 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found',
        data: null 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token',
        data: null 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        data: null 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication',
      data: null 
    });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required',
        data: null 
      });
    }

    if (!roles.includes(req.user.isAdmin ? 'admin' : 'user')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied - insufficient permissions',
        data: null 
      });
    }

    next();
  };
};

// Admin-only middleware
export const adminOnly = authorizeRoles('admin');
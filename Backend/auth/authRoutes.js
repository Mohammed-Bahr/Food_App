import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../User/UserModel.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password } = req.body;

    // Validation
    if (!FirstName || !LastName || !Email || !Password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields",
        data: null 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address",
        data: null 
      });
    }

    // Password validation
    if (Password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long",
        data: null 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User with this email already exists",
        data: null 
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({ FirstName, LastName, Email, Password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return response with user data (without password) and token
    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Registration failed: ${error.message}`,
      data: null 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Validation
    if (!Email || !Password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email and password",
        data: null 
      });
    }

    // Find user by email
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password",
        data: null 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(Password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password",
        data: null 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return response with user data (without password) and token
    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Login failed: ${error.message}`,
      data: null 
    });
  }
});

// Get current user profile (protected route)
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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

    // Return user data without password
    res.status(200).json({ 
      success: true, 
      message: "Profile retrieved successfully",
      data: user.toSafeObject()
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    
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
    
    res.status(500).json({ 
      success: false, 
      message: `Profile retrieval failed: ${error.message}`,
      data: null 
    });
  }
});

export default router;
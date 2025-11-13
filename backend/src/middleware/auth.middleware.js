import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token is in the 'Authorization' header
  // It's usually sent as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header (split 'Bearer' and the token)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the token's ID and attach them to the request
      // We exclude the password from being attached
      req.user = await User.findById(decoded.userId).select('-password');

      // 5. All good! Move to the next function (the actual controller)
      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If no token is found at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
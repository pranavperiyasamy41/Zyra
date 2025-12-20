import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for a specific User ID
 * @param {string} id - The MongoDB User ID
 * @returns {string} - Signed JWT Token
 */
const generateToken = (id) => {
  // Ensure you have JWT_SECRET in your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

export default generateToken;
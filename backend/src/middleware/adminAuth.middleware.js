// backend/src/middleware/adminAuth.middleware.js
const adminProtect = (req, res, next) => {
  // Check if the role is 'superadmin' OR 'admin'
  if (req.user && (req.user.role === 'superadmin' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access Denied: You do not have Super Admin privileges.' 
    });
  }
};
export default adminProtect;
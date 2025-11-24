// This function assumes the 'protect' middleware has already run 
// and attached the user object (req.user) to the request.

const adminProtect = (req, res, next) => {
  // Check if the user exists and has the necessary role
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    // 403 Forbidden: The server understands the request but refuses to authorize it.
    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
};

export default adminProtect;
export const adminProtect = (req, res, next) => {
    // Debugging: Let's see who is trying to enter
    console.log("Checking Admin Access for:", req.user?.username, "Role:", req.user?.role);

    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
      next();
    } else {
      console.log("⛔ Access Denied: Not an Admin");
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  };
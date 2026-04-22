export const authorizeRoles = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access denied: insufficent permissions"
            });
        }
        next();
    };
};

//protect route for national admin only
export const isNationalAdmin = (req, res, next) => {
  if (req.user.role !== "national_admin") {
    return res.status(403).json({
      success: false,
      message: "Only national admin allowed"
    });
  }
  next();
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next();
  };
};
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed"
    });
  }
  console.log("AUTH HEADER:", req.headers.authorization);
};

// import jwt from "jsonwebtoken";


// export const protect = (req, res, next) => {
//     let token;

//     //check if token exists in headers
// if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
//     try{
//         //Extract token from header
//         token = req.header.authorization.split(" ")[1];

//         //very token
//         const decoded = jwt.verify(token, "your_jwt_secret_key");

//         // Attach user info to request
//         req.user = decoded;

//         next();
//     }catch(error){
//         res.status(401).json({
//             success: false,
//             message: "Not authorized, token failed"
//         });
//     } ;
//     }else {
//         return res.status(401).json({
//             success: false,
//             message: "No token provided"
//         });
// }
// console.log("TOKEN:", token);
// console.log("SECRET:", process.env.JWT_SECRET);
// }

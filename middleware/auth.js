// import CustomErrorHandler from "../services/CustomErrorHandler.js";
// import JwtService from "../services/JwtService.js";

//     const auth = async (req , res , next)=>{
//     let authHeader = req.headers.authorization;
//         // console.log(authHeader);
//     if(!authHeader){
//         return next(CustomErrorHandler.unAuthorized())
//     }
//     console.log(authHeader);
//     try {
//         const token = authHeader.split(" ")[1];
//         const decodedToken = await JwtService.verify(token);

//         console.log(token);

//         // Ensure that the decoded token is in the expected format
//         if (!decodedToken || !decodedToken._id || !decodedToken.role) {
//             return next(CustomErrorHandler.unAuthorized());
//         }
//             console.log(decodedToken);
//         const user = {
//             _id: decodedToken._id,
//             role: decodedToken.role,
//         };

//         req.user = user;
//         next();
//     } catch (error) {
//         // Handle JWT verification errors and return an "unAuthorized" error
//         return next(CustomErrorHandler.unAuthorized());
//     }

// }

// export default auth;

import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Authorization header missing");
    return next(CustomErrorHandler.unAuthorized());
  }

  console.log("Authorization header:", authHeader);

  try {
    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    const decodedToken = JwtService.verify(token);

    if (!decodedToken || !decodedToken._id || !decodedToken.role) {
      console.log("Invalid decoded token");
      return next(CustomErrorHandler.unAuthorized());
    }

    const user = {
      _id: decodedToken._id,
      role: decodedToken.role,
    };

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle token expiration gracefully
      console.log("Token expired");
      return next(CustomErrorHandler.unAuthorized("Token expired"));
    } else {
      console.error("JWT verification error:", error);
      return next(CustomErrorHandler.unAuthorized());
    }
  }
};

export default auth;

// import CustomErrorHandler from "../services/CustomErrorHandler.js";
// import JwtService from "../services/JwtService.js";

// const auth = async (req, res, next) => {
//     let authHeader = req.headers.authorization;

//     if (!authHeader) {
//         console.log("Authorization header missing");
//         return next(CustomErrorHandler.unAuthorized());
//     }

//     console.log("Authorization header:", authHeader);

//     try {
//         const token = authHeader.split(" ")[1];
//         console.log("Token:", token);

//         let decodedToken;
//         let user; // Define user here

//         try {
//             decodedToken = JwtService.verify(token);
//         } catch (error) {
//             if (error.name === "TokenExpiredError") {
//                 console.log("Token expired");

//                 // Get user information here (you may need to fetch it from a database or another source)
//                 // For this example, let's assume you can get user information synchronously
//                 user = getUserInformation(); // Replace with the actual way to get user information

//                 // Handle token expiration by generating a new token
//                 const newToken = JwtService.sign({ _id: user._id, role: user.role });
//                 res.setHeader("Authorization", `Bearer ${newToken}`);
//                 decodedToken = JwtService.verify(newToken);
//             } else {
//                 throw error;
//             }
//         }

//         if (!decodedToken || !decodedToken._id || !decodedToken.role) {
//             console.log("Invalid decoded token");
//             return next(CustomErrorHandler.unAuthorized());
//         }

//         user = {
//             _id: decodedToken._id,
//             role: decodedToken.role,
//         };

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("JWT verification error:", error);
//         return next(CustomErrorHandler.unAuthorized());
//     }
// };

// export default auth;

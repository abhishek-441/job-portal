// import jwt from "jsonwebtoken";

// const isAuthenticated = (req, res, next) =>{
//     try {
//         const token = req.cookies.token;
//         if(!token){
//             return res.status(401).json({
//                 message:"User not authorized",
//                 success:false
//             })
//         }
//         const decode = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decode){
//             return res.status(401).json({
//                 message:"Invalid token",
//                 success:false
//             })
//         }
//         req.id = decode.userId;  //we get userId from token (usetId is stored at the time of token formation)
//         next();
//     } catch (error) {
//         console.log(error);
//     }
// }

// export default isAuthenticated;














// chatgpt

import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        // 1️⃣ Try to get token from cookies (browser)
        let token = req.cookies?.token;

        // 2️⃣ If not found, try Authorization header (Postman)
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "User not authorized",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔴 THIS LINE IS MOST IMPORTANT
        req.id = decoded.userId;

        next();
    } catch (error) {
        console.log("Auth error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};

export default isAuthenticated;










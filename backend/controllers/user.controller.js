// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";

// export const register = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, password, role } = req.body;
//         if (!fullname || !email || !phoneNumber || !password || !role) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false

//             })
//         };

//         //cloudinary
//         const file = req.file;
//         const fileUri = getDataUri(file);
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({
//                 message: "User already exist with this email",
//                 success: false
//             })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await User.create({
//             fullname,
//             email,
//             phoneNumber,
//             password: hashedPassword,
//             role,
//             profile:{
//                 profilePhoto:cloudResponse.secure_url,
//             }
//         });

//         return res.status(201).json({
//             message: "Account created successfully",
//             success: true
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const login = async (req, res) => {
//     try {
//         const { email, password, role } = req.body;
//         if (!email || !password || !role) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false
//             })
//         }
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({
//                 message: "Incorrect email or password",
//                 success: false
//             })
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(400).json({
//                 message: "Incorrect email or password",
//                 success: false
//             })
//         }
//         if (role !== user.role) {
//             return res.status(400).json({
//                 message: "Accoount doesn't exist with current role",
//                 success: false
//             })
//         }
//         const tokenData = {
//             userId: user._id
//         }

//         const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

//         user = {
//             id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         }

//         return res.status(200).cookie("token", token,
//             {
//                 maxAge: 1 * 24 * 60 * 60 * 1000,
//                 httpOnly: true,
//                 sameSite: 'strict'
//             }).json({
//                 message: `Welcome back ${user.fullname}`,
//                 user,
//                 success: true
//             })
//     } catch (error) {
//         console.log(error);
//     }
// }



// //LECTURE
// // export const logout = async (req, res) => {
// //     try {
// //         return res.status(200).cookie("token", "", { maxAge: 0 }.json({
// //             message: "Logged out successfully",
// //             success: true
// //         }))
// //     } catch (error) {
// //         console.log(error);
// //     }
// // }



// // CHATGPT
// export const logout = (req, res) => {
//     try {
//         res.clearCookie("token", {
//             httpOnly: true,
//             sameSite: "strict",
//             secure: false, // true in production
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Logged out successfully",
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Logout failed",
//         });
//     }
// };



// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body;
//         const file = req.file;  //**** */

//         //cloudinary aayege idhar
//         const fileUri = getDataUri(file);
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

//         let skillArray;
//         if (skills) {
//             skillArray = skills.split(","); // Convert string in to comma separated array
//         }
//         const userId = req.id;

//         let user = await User.findById(userId);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found",
//                 success: false
//             })
//         }

//         // await User.findByIdAndUpdate(userId, {
//         //     fullname,
//         //     email,
//         //     phoneNumber,
//         //     bio,
//         //     skills: skillArray
//         // }, { new: true });

//         if (fullname) user.fullname = fullname;
//         if (email) user.email = email;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (bio) user.profile.bio = bio;
//         if (skills) user.profile.skills = skillArray;

//         // user.fullname = fullname,
//         // user.email = email,
//         // user.phoneNumber = phoneNumber,
//         // user.profile.bio = bio,
//         // user.profile.skills = skillArray

//         //resume comes later here
//         if(cloudResponse){
//             user.profile.resume = cloudResponse.secure_url;  //save the cloudinary url
//             user.profile.resumeOriginalName = file.originalname     // providing name to the pdf
//         }

//         await user.save();

//         user = {
//             id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         }

//         return res.status(200).json({
//             message: "Profile updated successfully",
//             user,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }









import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        }

        // Profile photo
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Profile photo is required",
                success: false
            });
        }

        const fileUri = getDataUri(file);

        const cloudResponse = await cloudinary.uploader.upload(
            fileUri.content
        );

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error while creating account",
            success: false
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            });
        }

        // JWT data
        const tokenData = {
            userId: user._id
        };

        // Create JWT token
        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // User data sent to frontend
        user = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Production cookie configuration
        const isProduction = process.env.NODE_ENV === "production";

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: isProduction ? "none" : "strict",
                secure: isProduction
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true
            });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error while logging in",
            success: false
        });
    }
};


export const logout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: isProduction ? "none" : "strict",
            secure: isProduction
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            bio,
            skills
        } = req.body;

        const file = req.file;

        const userId = req.id;

        // Find user
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Update basic information
        if (fullname !== undefined) {
            user.fullname = fullname;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (phoneNumber !== undefined) {
            user.phoneNumber = phoneNumber;
        }

        // Update bio
        if (bio !== undefined) {
            user.profile.bio = bio;
        }

        // Update skills
        if (skills !== undefined) {
            const skillArray = skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            user.profile.skills = skillArray;
        }

        // Upload resume ONLY if a new file was selected
        if (file) {
            const fileUri = getDataUri(file);

            const cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                {
                    resource_type: "auto"
                }
            );

            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        // Save updated user
        await user.save();

        // Updated user data
        const updatedUser = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error updating profile",
            success: false
        });
    }
};
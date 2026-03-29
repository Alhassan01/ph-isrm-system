import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Login user and generate JWT token for authentication
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// //Login user and generate JWT token for authentication
// export const loginUser = async (req, res) => {
//     try{
//         const {email, password} = req.body;
//         //1. Check if user exists
//         const user = await User.findOne({email});

//         //Respond with error message if user not found
//         if(!user){
//             return res.status(404).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }

//         //2. Compare password
//         const isMatch = await bcrypt.compare(password, user.password);

//         //Respond with error message if input password does not match the hashed password in the database
//         if(!isMatch){
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }
//         //3. Generate JWT token for authentication
//         const token = jwt.sign(
//             {id: user._id, role: user.role},
//             "your_jwt_secret_key",
//             {expiresIn: "1d"}
//         );

    

//         res.status(200).json({
//             success: true,
//             token
//         });

//     }catch(error){
//             res.status(500).json({
//                 success: false,
//                 message: error.message
//             });
//     }
// };

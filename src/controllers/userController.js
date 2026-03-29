import User  from "../models/user.js";

//Create a new user in the database using the User model and send a response back to the client
export const createUser = async (req, res, next) => {
    try{
        const {name, email, password, role} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json({
            success: true,
            data: user
        });
    }catch(error){
        next(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
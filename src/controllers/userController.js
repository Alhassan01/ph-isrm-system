import User  from "../models/user.js";
import bcrypt from "bcryptjs";

//Create a new user in the database using the User model and send a response back to the client
export const createUser = async (req, res, next) => {
    try{
        const {name, email, password, role} = req.body;

        // const user = await User.create({
        //     name,
        //     email,
        //     password,
        //     role
        // });

        // ✅ Validate
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Check existing
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ HASH PASSWORD (VERY IMPORTANT)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });


        res.status(201).json({
            success: true,
            data: user
        });
    }catch(error){
        console.log("CREATE USER ERROR: ", error);
        next(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    success: true,
    data: users
  });
};

// ✅ Update User Role
export const updateUser = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//imported code
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";

// // ✅ Create User (Admin only)
// export const createUser = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//       role
//     });

//     res.status(201).json({
//       success: true,
//       data: user
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get All Users
// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");

//     res.json({
//       success: true,
//       data: users
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
//imported code end
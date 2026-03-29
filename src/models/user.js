import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//User schema defining the structure of user documents(data) in MongoDB database
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
     facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility"
    },
    role: {
        type: String,
        enum: [
            "facility_reporter",
            "district_officer",
            "regional_supervisor",
            "national_admin",
            "auditor"
        ],
        default: "facility_reporter"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hashed/protect user password before saving to the database
userSchema.pre("save", async function(){
    if(!this.isModified("password")) {
        return ;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

//Create user collection in mongoodb using the userschema above
const User = mongoose.model("User", userSchema);

export default User;
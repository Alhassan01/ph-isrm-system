import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    location: String,
    district: String,
    region: String,
    type:{
        type: String,
        enum: ["clinic", "hospital"],
        default: "clinic"
    }
},{timestamps: true});

const Facility = mongoose.model("Facility", facilitySchema);

export default Facility;
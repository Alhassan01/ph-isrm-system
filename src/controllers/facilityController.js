import Facility from "../models/facility.js";

// ✅ Create Facility
export const createFacility = async (req, res) => {
  try {
    const { name, location, district, region } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const facility = await Facility.create({
      name,
      location,
      district,
      region
    });

    res.status(201).json({
      success: true,
      data: facility
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create facility
// export const createFacility = async (req, res) => {
//   try {
    
//     const facility = await Facility.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: facility
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all facilities
export const getFacilities = async (req, res) => {
  const facilities = await Facility.find();

  res.json({
    success: true,
    data: facilities
  });
};

// ✅ Update Facility
export const updateFacility = async (req, res) => {
  try {
    const { name, location } = req.body;

    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true }
    );

    res.json({
      success: true,
      data: facility
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Facility
export const deleteFacility = async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Facility deleted"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//imported code for reference
// // ✅ Create Facility
// export const createFacility = async (req, res) => {
//   try {
//     const { name, location } = req.body;

//     if (!name) {
//       return res.status(400).json({ message: "Name is required" });
//     }

//     const facility = await Facility.create({
//       name,
//       location
//     });

//     res.status(201).json({
//       success: true,
//       data: facility
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get Facilities
// export const getFacilities = async (req, res) => {
//   try {
//     const facilities = await Facility.find();

//     res.json({
//       success: true,
//       data: facilities
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//imported code for reference




// export const createFacility = async (req, res) => {
//   try {
//     const { name, location } = req.body;

//     const facility = {
//       name,
//       location
//     };

//     res.status(201).json({
//       success: true,
//       data: facility
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
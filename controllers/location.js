const { StatusCodes } = require("http-status-codes");
const err = require("../middleware/error");
const LocationModel = require("../models/locations");
const StateModel = require("../models/statesInNigeria");

async function checkexistingLocation(location) {
  try {
    // Check if email exists
    const existingLocation = await LocationModel.findOne({
      name: location,
    }).exec();
    if (existingLocation) {
      return { exists: true, field: "location" };
    }

    return { exists: false };
  } catch (error) {
    next(err(error));
  }
}
/* GET ALL LOCATIONS */
async function getAllLocations(req, res, next) {
  try {
    const locations = await LocationModel.find();
    // Check if there are no Location found
    if (!locations || locations.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    return res.status(StatusCodes.OK).json({ success: true, data: locations });
  } catch (error) {
    next(err(error));
  }
}
async function getLocation(req, res, next) {
  const name = req.query.name;

  if (!name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: { message: "Kindly enter a valid Location Name" },
    });
  }
  try {
    const location = await LocationModel.findOne({ name: name });
    // If location is not found, return 404 Not Found
    if (!location) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "location not found" });
    }
    // If company is found, return it
    return res.status(StatusCodes.OK).json({ success: true, data: location });
  } catch (err) {
    next(err(error));
  }
}

/* ADD A LOCATION */
async function addLocation(req, res, next) {
  let { name } = req.body;

  try {
    // If incomplete data is sent, return 400 Not Found
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Location name is missing!",
      });
    } else {
      const locationExist = await checkexistingLocation(name);

      if (locationExist.exists) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ success: false, message: `Location already Exist!` });
      } else {
        await LocationModel.create({ name });

        return res
          .status(StatusCodes.OK)
          .json({ success: false, message: `Location created Successfully!` });
      }
    }
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}

async function multipleLocation(req, res, next) {
  try {
    // Insert the array of locations objects into the database
    const result = await LocationModel.insertMany(req.body);
    res
      .status(200)
      .json({ success: true, message: "Locations added successfully:" });
    return result;
  } catch (error) {
    next(err(error)); // Rethrow the error for handling in the caller
  }
}

async function locationByState(req, res, next) {
  try {
    const { name } = req.query;

    // Fetch the state ID based on the state name
    const state = await StateModel.findOne({ name: name });
    if (!state) {
      return res.status(404).json({ success: false, error: "State not found" });
    }


    // Fetch locations based on the state ID
    const locations = await LocationModel.find({ state: state.name }).select(
      "name"
    );

    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    next(err(error)); // Rethrow the error for handling in the caller
  }
}

module.exports = {
  multipleLocation,
  addLocation,
  getLocation,
  getAllLocations,
  locationByState,
};

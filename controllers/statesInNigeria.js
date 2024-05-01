const { StatusCodes } = require("http-status-codes");
const err = require("../middleware/error");
const StatesModel = require("../models/statesInNigeria");

async function checkexistingState(state) {
  try {
    // Check if state exists
    const existingState = await StatesModel.findOne({
      name: state,
    }).exec();
    if (existingState) {
      return { exists: true, field: "state" };
    }

    return { exists: false };
  } catch (error) {
    next(err(error));
  }
}
/* GET ALL STATES */
async function getAllStates(req, res, next) {
  try {
    const states = await StatesModel.find();
    // Check if there are no Location found
    if (!states || states.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    return res.status(StatusCodes.OK).json({ success: true, data: states });
  } catch (error) {
    next(err(error));
  }
}
async function getState(req, res, next) {
  const name = req.query.name;

  if (!name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: { message: "Kindly enter a valid State Name" },
    });
  }
  try {
    const state = await StatesModel.findOne({ name: name });
    // If state is not found, return 404 Not Found
    if (!state) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "state not found" });
    }
    // If company is found, return it
    return res.status(StatusCodes.OK).json({ success: true, data: state });
  } catch (error) {
    next(err(error));
  }
}

/* ADD A STATE */
async function addState(req, res, next) {
  let { name } = req.body;

  try {
    // If incomplete data is sent, return 400 Not Found
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "State name is missing!",
      });
    } else {
      const stateExist = await checkexistingState(name);

      if (stateExist.exists) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ success: false, message: `State already Exist!` });
      } else {
        await StatesModel.create({ name });

        return res
          .status(StatusCodes.OK)
          .json({ success: true, message: `State created Successfully!` });
      }
    }
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}

async function multipleState(req, res, next) {
  try {
    // Insert the array of states objects into the database
    const result = await StatesModel.insertMany(req.body);
    res
      .status(200)
      .json({ success: true, message: "States added successfully:" });
    return result;
  } catch (error) {
    next(err(error)); // Rethrow the error for handling in the caller
  }
}

module.exports = {
  multipleState,
  addState,
  getState,
  getAllStates,
};

const { StatusCodes } = require("http-status-codes");
const Company = require("../models/company");
const bcrypt = require("bcryptjs");
const StateModel = require("../models/statesInNigeria");
const err = require("../middleware/error");

// Function to check if email or phone number already exists
async function checkExistingEmailAndPhone(email, phoneNumber) {
  try {
    // Check if email exists
    const existingEmail = await Company.findOne({ email: email }).exec();
    if (existingEmail) {
      return { exists: true, field: "email" };
    }

    // Check if phone number exists
    const existingPhoneNumber = await Company.findOne({
      phoneNumber: phoneNumber,
    });
    if (existingPhoneNumber) {
      return { exists: true, field: "phoneNumber" };
    }

    // Neither email nor phone number exists
    return { exists: false };
  } catch (error) {
    next(err(error));
  }
}

//GET UNIQUE STATES
const getAllUniqueStates = async (req, res, next) => {
  try {
    // Find all unique states chosen by sellers
    const sellers = await Company.find({ category: "seller" });

    if (!sellers || sellers.length == 0) {
      return res.status(404).json({ success: true, data: sellers });
    }
    // Extract the states from the sellers
    const uniqueStates = sellers.reduce((acc, seller) => {
      seller.states.forEach((state) => {
        if (!acc.includes(state.name)) {
          acc.push(state.name);
        }
      });
      return acc;
    }, []);

    return res.status(200).json({ success: true, data: uniqueStates });
  } catch (error) {
    next(err(error));
  }
};
/* GET ALL COMPANIES BASED ON A STATE*/
async function companiesByState(req, res, next) {
  const { state } = req.query;
  try {
    const companies = await Company.find({
      states: state,
      category: "seller",
    }).select("companyName");

    // If no seller companies are found for that state, return 404 Not Found
    if (companies.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        data: companies,
        message: "No seller companies were found for the provided state",
      });
    }
    // If seller companies are found, return their names
    return res.status(StatusCodes.OK).json({ data: companies });
  } catch (error) {
    // Handle server errors
    // Throw an error using next middleware
    next(err(error));
  }
}

async function getBranchesBystate(req, res, next) {
  const { state } = req.query;

  try {
    const branches2 = await Company.aggregate([
      // Unwind the branches array
      { $unwind: "$branches" },
      // Match branches with the specified state
      { $match: { "branches.state.name": state } },
      // Unwind the addresses array within the matched branches
      { $unwind: "$branches.state.addresses" },
      // Group the addresses to ensure uniqueness
      { $group: { _id: "$branches.state.addresses.name" } },
      // Project the address field
      { $project: { _id: 0, address: "$_id" } },
    ]);
    const branches = await Company.aggregate([
      // Unwind the states array
      { $unwind: "$states" },
      // Match states with the specified state name
      { $match: { "states.name": state } },
      // Unwind the addresses array within the matched states
      { $unwind: "$states.addresses" },
      // Group the addresses to ensure uniqueness
      { $group: { _id: "$states.addresses.name" } },
      // Project the address field
      { $project: { _id: 0, address: "$_id" } },
    ]);

    // If no branches found for the state, send a 404 response
    if (!branches || branches.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        data: branches,
        message: "No branches found for the specified state",
      });
    }
    // Return the branches of the selected state
    return res.status(StatusCodes.OK).json({ data: branches });
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}
async function companiesByLocation(req, res, next) {
  const { name } = req.query;

  try {
    // Find companies that have the specified location ID
    const companies = await Company.find({
      "states.addresses.name": name,
    }).select("companyName price");

    // If no companies found for the location ID, send a 404 response
    if (!companies || companies.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        data: companies,
        message: "No companies found for the specified location ID",
      });
    }
    // Return the companies
    return res.status(StatusCodes.OK).json({ data: companies });
  } catch (error) {
    next(err(error));
  }
}
async function companyBranches(req, res, next) {
  const { companyId, state } = req.query;

  try {
    const isCompanyIdValid = await Company.findById(companyId).select(
      "-password"
    );
    const isStateNameValid = await StateModel.findOne({ name: state });

    // If company is not found for that state, return 404 Not Found
    if (isCompanyIdValid?.length === 0 || isStateNameValid?.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Invalid Datas supplied" });
    }
    // If company is found,
    // Find branches of the company in the specified state
    const branchesInState = isCompanyIdValid.branches.filter(
      (branch) => branch.state === state
    );
    return res.status(StatusCodes.OK).json({ data: branchesInState });
  } catch (error) {
    next(err(error));
  }
}
async function addCompany(req, res, next) {
  const {
    companyName,
    companyAddress,
    email,
    phoneNumber,
    password,
    category,
    accountNumber,
    accountName,
    bankName,
    states,
    state,
    price,
  } = req.body;

  try {
    if (category === "buyer") {
      // If incomplete data is sent, return 400 Not Found
      if (
        !companyName ||
        !email ||
        !phoneNumber ||
        !state ||
        !password ||
        !companyAddress
      ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ data: { message: "Some required fields are missing!" } });
      }
    } else {
      // If incomplete data is sent, return 400 Not Found
      if (
        !companyName ||
        !email ||
        !phoneNumber ||
        !states ||
        !price ||
        !accountName ||
        !price ||
        !accountNumber ||
        !password ||
        !bankName ||
        !companyAddress
      ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ data: { message: "Some required fields are missing!" } });
      }
    }
    const phoneNumberEmailExist = await checkExistingEmailAndPhone(
      email,
      phoneNumber
    );

    if (phoneNumberEmailExist.exists) {
      if (phoneNumberEmailExist.field.includes("phoneNumber")) {
        return res.status(StatusCodes.CONFLICT).json({
          data: { message: `Phone Number already Exist!` },
        });
      } else {
        return res.status(StatusCodes.CONFLICT).json({
          data: { message: `Email address already Exist!` },
        });
      }
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newCompany = {
        companyName,
        companyAddress,
        email,
        phoneNumber,
        category,
        accountNumber,
        accountName,
        bankName,
        price,
        password: hash,
      };
      if (states !== undefined) {
        newCompany.states = states;
      }
      if (state !== undefined) {
        newCompany.state = state;
      }
      const createdCompany = await Company.create(newCompany);

      return res.status(StatusCodes.OK).json({
        data: {
          id: createdCompany._id,
          message: `Registration Successful!`,
        },
      });
    }
  } catch (error) {
    console.log({ "An Error Occured!": error });
    next(err(error));
  }
}

async function getCompanies(req, res, next) {
  try {
    const companies = await Company.find().select("-password");

    // If company is not found, return 404 Not Found
    if (companies.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No Company was found" });
    }
    // If company is found, return it
    return res.status(StatusCodes.OK).json({ data: companies });
  } catch (error) {
    next(err(error));
  }
}

async function getCompany(req, res, next) {
  const id = req.query.id;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: { message: "Kindly enter a valid Company ID" } });
  }
  try {
    const companies = await Company.findById(id).select("-password -__v");
    // If company is not found, return 404 Not Found
    if (!companies) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No Company was found" });
    }
    // If company is found, return it
    return res
      .status(StatusCodes.OK)
      .json({ data: companies, status: StatusCodes.OK });
  } catch (error) {
    next(err(error));
  }
}

async function updateCompany(req, res, next) {
  try {
    const id = req.params.id;
    const newData = req.body;

    console.log(id, newData);

    // Update the document in the collection
    const updatedDoc = await Company.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!updatedDoc) {
      return res
        .status(404)
        .json({ message: "Document not found", status: 404 });
    }

    res.status(200).json({ msg: "Updated Successfully", status: 200 });
  } catch (error) {}
}

module.exports = {
  companiesByState,
  updateCompany,
  getAllUniqueStates,
  getBranchesBystate,
  companiesByLocation,
  companyBranches,
  addCompany,
  getCompanies,
  getCompany,
};

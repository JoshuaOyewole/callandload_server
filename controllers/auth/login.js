const bcryptjs = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const User = require("../../models/company");
const jwt = require("jsonwebtoken");
const err = require("../../middleware/error");

// Login
async function Login(req, res, next) {
  try {
    if (
      req.body.email === (undefined || "" || " ") ||
      req.body.password === (undefined || "" || " ")
    ) {
      return res.status(403).json({ err: "Kindly fill the required fields" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Incorrect Credentials Entered!" });

    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Incorrect Password, Kindly Try Again!" });
    }
    const isSeller = user.category == "seller" ? true : false;
    const { email, companyName, phoneNumber, _id: id } = user; //Destructing password from the user details recieved...

    const jwt_payload = {
      email,
      companyName,
      id,
    };

    const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);

    return res.status(StatusCodes.OK).json({
      success: true,
      status: 200,
      message: `Logged in successfully!`,
      details: {
        email,
        companyName,
        phoneNo:phoneNumber,
        id,
        isSeller,
      },
      accountVerified: user.accountVerified,
      token: token,
    });
  } catch (error) {
    next(err(error));

    next(createError(err));
  }
}

module.exports = Login;

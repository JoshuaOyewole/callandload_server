const Company = require("../models/company");
const { sendOTP, verifyOTP, deleteOTP } = require("../util/otp");
const { hashData } = require("../util/hashData");

const sendAccountVerificationOTP = async (req, res, next) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email Address is required" });
    }

    //trim off whiteSpace
    email = email.trim();

    const existingCompany = await Company.findOne({ email });

    if (!existingCompany) {
      return res
        .status(404)
        .json({ msg: "Email Address provided does not Exist!" });
    }
    const otpDetails = {
      email,
      subject: "Email Verification",
      message: "Enter the Code below to verify your Email ",
      duration: 1,
    };

    await sendOTP(otpDetails);

    res.status(200).json({
      message: `An OTP has been successfully sent to your Email!`,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const forgetPWD = async (req, res, next) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email Address is required" });
    }

    //trim off whiteSpace
    email = email.trim();

    const existingCompany = await Company.findOne({ email });

    if (!existingCompany) {
      return res
        .status(404)
        .json({ msg: "Email Address provided does not Exist!" });
    }
    const otpDetails = {
      email,
      subject: "Password Reset",
      message: "Enter the Code below to reset your Password",
      duration: 1,
    };

    await sendOTP(otpDetails);

    res.status(200).json({
      success: true,
      status: 200,
      message: `OTP has been successfully sent to your Email!`,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const resetPWD = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    /* VALIDATIONs */
    if (!(email && otp && newPassword)) {
      return res
        .status(400)
        .json({ msg: "Empty Credentials are not allowed!" });
    }

    const validOTP = await verifyOTP({ email, otp });

    if (!validOTP) {
      return res.status(400).json({ msg: "Incorrect OTP Entered!. Try Again" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "Password is too Short!" });
    }

    const hashedNewPassword = hashData(newPassword);

    //Update Company Record
    await Company.updateOne({ email }, { password: hashedNewPassword });

    //clear any old Record
    await deleteOTP(email);

    res.status(200).json({
      success: true,
      status: 200,
      message: `Password Reset Successful!`,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
const confirmVerificationOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    /* VALIDATIONs */
    if (!(otp && email)) {
      return res
        .status(400)
        .json({ msg: "Kindly enter the OTP sent to your Email!" });
    }

    const validOTP = await verifyOTP({ email, otp });

    if (!validOTP) {
      return res.status(400).json({ msg: "Incorrect OTP Entered!. Try Again" });
    }

    //Update Company Record
    await Company.updateOne({ email }, { accountVerified: true });

    //clear any old Record
    await deleteOTP(email);

    res.status(200).json({
      message: `Account Verified Successful!`,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
module.exports = {
  forgetPWD,
  resetPWD,
  sendAccountVerificationOTP,
  confirmVerificationOTP,
};

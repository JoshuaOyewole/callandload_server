const express = require("express");
const {
  forgetPWD,
  resetPWD,
  sendAccountVerificationOTP,
  confirmVerificationOTP,
} = require("../controllers/forgot_pwd");

const router = express.Router();

//FORGOTTEN PASSWORD
router.post("/forgetpwd", forgetPWD);
router.post("/resetpwd", resetPWD);
router.post("/sendaccountverificationotp", sendAccountVerificationOTP);
router.post("/confirmverificationotp", confirmVerificationOTP);
module.exports = router;

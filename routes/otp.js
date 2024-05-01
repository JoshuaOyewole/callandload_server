const express = require("express");
const { sendOTPController } = require("../controllers/otp");

const router = express.Router();

//USER LOGIN
router.post("/", sendOTPController);

module.exports = router;

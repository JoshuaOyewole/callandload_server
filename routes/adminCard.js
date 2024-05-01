const express = require("express");
const router = express.Router();
const {
  getCardsDatas,
  getTopSalesByLocation,
} = require("../controllers/adminCard");

router.get("/", getCardsDatas);
router.get("/getTopSalesByLocation", getTopSalesByLocation);

module.exports = router;

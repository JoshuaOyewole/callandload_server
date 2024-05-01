const express = require("express");
const router = express.Router();
const {
  multipleLocation,
  addLocation,
  getLocation,
  getAllLocations,
  locationByState
} = require("../controllers/location");

router.get("/all", getAllLocations);
router.post("/", addLocation);
router.post("/addmultiplelocation", multipleLocation);
router.get("/", getLocation);
router.get("/locationByState", locationByState);

module.exports = router;

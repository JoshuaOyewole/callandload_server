const express = require("express");
const router = express.Router();
const {
  multipleState,
  addState,
  getState,
  getAllStates,
} = require("../controllers/statesInNigeria");

router.get("/all", getAllStates);
router.post("/", addState);
router.post("/addmultiplestate", multipleState);
router.get("/", getState);

module.exports = router;

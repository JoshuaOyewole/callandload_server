const express = require("express");
const router = express.Router();
//import {verifyToken} from "../../middleware/verifyToken";
const {
  addCompany,
  companiesByState,
  getAllUniqueStates,
  getCompanies,
  getCompany,
  companyBranches,
  getBranchesBystate,
  companiesByLocation,
  updateCompany,
} = require("../controllers/company");

router.get("/byState", companiesByState);
router.post("/", addCompany);
router.put("/update/:id", updateCompany);
router.get("/", getCompanies);
router.get("/single", getCompany);
router.get("/branches", companyBranches);
router.get("/getBranchesBystate", getBranchesBystate);
router.get("/companiesByLocation", companiesByLocation);
router.get("/sellersstate", getAllUniqueStates);

module.exports = router;

const express = require("express");
const router = express.Router();
//import {verifyToken} from "../../middleware/verifyToken";
const {
  getAllInvoice,
  createInvoice,
  getInvoiceById,
} = require("../controllers/invoice");

router.get("/", getAllInvoice);
router.post("/", createInvoice);
router.get("/invoice", getInvoiceById);
module.exports = router;

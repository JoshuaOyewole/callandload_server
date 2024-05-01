const express = require("express");
const generateInvoicePdf = require("../controllers/pdf");
const router = express.Router();

router.post("/", generateInvoicePdf);

module.exports = router;

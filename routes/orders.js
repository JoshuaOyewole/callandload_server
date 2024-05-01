const express = require("express");
const router = express.Router();
const { getAllOrders, updateOrder, makeOrder, getOrder } = require( "../controllers/orders");

router.post('/', makeOrder);
router.get('/', getAllOrders);
router.put("/", updateOrder);
router.get("/single", getOrder);

module.exports = router;

const { StatusCodes } = require("http-status-codes");
const err = require("../middleware/error");
const OrderModel = require("../models/orders");

async function makeOrder(req, res, next) {
  const {
    buyerCompanyName,
    email,
    sellerCompanyState,
    sellerCompanyName,
    pickupStateAddress,
    buyerDestination,
    quantity,
    productAmount,
    totalCost,
    sellerCompanyId,
    buyerCompanyId,
  } = req.body;

  try {
    // If incomplete data is sent, return 400 Not Found
    if (
      !buyerCompanyName ||
      !email ||
      !sellerCompanyState ||
      !sellerCompanyName ||
      !pickupStateAddress ||
      !buyerDestination ||
      !quantity ||
      !productAmount ||
      !sellerCompanyId ||
      !totalCost
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: { message: "Some required fields are missing!" } });
    } else {
      //let prooduct_totalCost = parseInt(quantity) * parseInt(productAmount);

      const newOrder = await OrderModel.create({
        buyerCompanyName,
        email,
        sellerCompanyState,
        sellerCompanyName,
        pickupStateAddress,
        buyerDestination,
        quantity,
        totalCost,
        productAmount,
        sellerCompanyId,
        buyerCompanyId,
      });

      return res
        .status(StatusCodes.OK)
        .json({ data: { id: newOrder._id, message: `Purchase Successfull!` } });
    }
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}
async function getOrder(req, res, next) {
  const { id } = req.query;

  try {
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Kindly enter a valid Order Id" });
    }
    const orders = await OrderModel.findById({ _id: id });
    // If order is not found, return 404 Not Found
    if (!orders || orders.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No Order was found" });
    }
    // If order is found, return it
    return res.status(StatusCodes.OK).json({ data: orders });
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}
async function updateOrder(req, res, next) {
  try {
    const {
      buyerCompanyName,
      buyerCompanyId,
      email,
      sellerCompanyState,
      sellerCompanyName,
      pickupStateAddress,
      buyerDestination,
      quantity,
      productAmount,
      buyerPhoneNumber,
      sellerCompanyId,
      totalCost,
      id,
    } = req.body;

    const updateData = {
      buyerCompanyName,
      buyerCompanyId,
      email,
      sellerCompanyState,
      sellerCompanyName,
      pickupStateAddress,
      buyerDestination,
      quantity,
      status: "completed",
      productAmount,
      buyerPhoneNumber,
      sellerCompanyId,
      totalCost,
      id,
    };
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Kindly provide a valid ID" });
    }
    //Chck if the order has been processed

    const orderStatus = await OrderModel.findById(id).select("status");

    if (orderStatus.status === "initiated") {
      // Update the order document by ID
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      // Check if the order exists and was updated successfully
      if (!updatedOrder) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Order not found" });
      }

      // If the order was successfully updated, send the updated order object as response
      res
        .status(StatusCodes.OK)
        .json({ message: "Order updated successfully", data: updatedOrder });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Order has been processed already!" });
    }
  } catch (error) {
    next(err(error));
  }
}
async function getAllOrders(req, res, next) {
  try {
    const orders = await OrderModel.find();

    // If order is not found, return 404 Not Found
    if (orders.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No Order was found" });
    }
    // If order is found, return it
    return res.status(StatusCodes.OK).json({ data: orders });
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}

module.exports = {
  getAllOrders,
  updateOrder,
  getOrder,
  makeOrder,
};

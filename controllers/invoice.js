const { StatusCodes } = require("http-status-codes");
const err = require("../middleware/error");
const InvoiceModel = require("../models/invoice");
const OrderModel = require("../models/orders");
const createError = require("../middleware/error");
const Company = require("../models/company");

async function createInvoice(req, res, next) {
  const { orderId } = req.body;

  try {
    const order = await OrderModel.findById(orderId).exec();
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: { message: "Order doesn't Exist!" } });
    }
    //Extract datas from the Orders
    let {
      buyerCompanyName,
      email,
      sellerCompanyState,
      sellerCompanyName,
      pickupStateAddress,
      buyerDestination,
      quantity,
      totalCost,
      productAmount,
      buyerPhoneNumber,
      sellerCompanyId,
      buyerCompanyId,
    } = order;

    /* Get the seller company Acc No, Acc Name and Bank Name*/
    const companyBankDetails = await Company.findOne({
      _id: sellerCompanyId,
    }).select("accountNumber accountName bankName phoneNumber email");

    const newInvoice = await InvoiceModel.create({
      buyerCompanyName,
      buyerCompanyId,
      email,
      sellerCompanyState,
      sellerCompanyName,
      pickupStateAddress,
      buyerDestination,
      quantity,
      totalCost,
      productAmount,
      buyerPhoneNumber,
      sellerCompanyId,
      accountNumber: companyBankDetails.accountNumber,
      accountName: companyBankDetails.accountName,
      bankName: companyBankDetails.bankName,
      sellerPhoneNumber: companyBankDetails.phoneNumber,
      sellerEmail: companyBankDetails.email,
    });

    return res.status(StatusCodes.OK).json({
      data: {
        id: newInvoice._id,
        message: `Invoice generated Successfully!`,
      },
    });
  } catch (error) {
    // Handle server errors
    next(err(error));
  }
}
async function getAllInvoice(req, res, next) {
  const { userId } = req.query;

  try {
    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "userId parameter is required" });
    }
    // Fetch invoices based on sellerCompanyId (userId)
    const invoices = await InvoiceModel.find({
      $or: [{ buyerCompanyId: userId }, { sellerCompanyId: userId }],
    }).select("-sellerCompanyId, -buyerCompanyId, -__v");

    // If no invoices found, return 404 Not Found
    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        data: [],
        message: "No invoices found for the specified Company",
      });
    }

    // If invoices found, return them
    return res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(err(error));
  }
}
async function getInvoiceById(req, res, next) {
  const { id } = req.query; // Get the invoice ID from request parameters

  try {
    // Find the invoice by its ID
    const invoice = await InvoiceModel.findById(id);

    // If invoice is not found, return 404 Not Found
    if (!invoice || invoice?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Invoice not found" });
    }
    // If invoice is found, return it
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(err(error));
  }
}
module.exports = {
  getAllInvoice,
  createInvoice,
  getInvoiceById,
};

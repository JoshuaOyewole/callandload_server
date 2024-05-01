const { StatusCodes } = require("http-status-codes");
const err = require("../middleware/error");
const InvoiceModel = require("../models/invoice");
const OrderModel = require("../models/orders");

async function getCardsDatas(req, res, next) {
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
      return res.status(200).json({
        success: false,
        data: {
          totalTransactions: 0,
          totalPendingTransactions: 0,
          totalRevenue: 0,
        },
        message: "No invoices found for the specified Company",
      });
    }
    // Calculate total transactions
    const totalTransactions = invoices.length;

    // Filter invoices to get pending transactions
    const pendingTransactions = invoices.filter(
      (invoice) => invoice.status !== "paid"
    );
    const totalPendingTransactions = pendingTransactions.length;

    // Calculate total revenue (sum of transaction totalCost whose status is paid)
    const totalRevenue = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((total, invoice) => total + invoice.totalCost, 0);

    // If invoices found, return them
    return res.status(200).json({
      success: true,
      data: { totalTransactions, totalPendingTransactions, totalRevenue },
    });
  } catch (error) {
    next(err(error));
  }
}

async function getTopSalesByLocation(req, res, next) {
  try {
    const userId = req.query.userId;
    const topPickupStates = await OrderModel.aggregate([
      {
        $match: { status: "completed", sellerCompanyId: userId },
      },
      {
        $group: {
          _id: "$pickupStateAddress",
          totalSales: { $sum: "$totalCost" },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json(topPickupStates);
  } catch (error) {
    console.error("Error fetching top pickup states:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  getCardsDatas,
  getTopSalesByLocation,
};

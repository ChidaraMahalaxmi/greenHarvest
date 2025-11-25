import Order from "../models/Order.js";

export const salesReport = async (req, res) => {
  try {
    const { period = "daily", start, end } = req.query;
    const match = {};
    if (start) match.createdAt = { $gte: new Date(start) };
    if (end) match.createdAt = match.createdAt ? { ...match.createdAt, $lte: new Date(end) } : { $lte: new Date(end) };

    let groupStage;
    if (period === "weekly") {
      groupStage = { _id: { week: { $isoWeek: "$createdAt" }, year: { $isoWeekYear: "$createdAt" } } };
    } else {
      groupStage = { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } };
    }

    const pipeline = [
      { $match: match },
      { $unwind: "$items" },
      { $group: { ...groupStage, totalSales: { $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] } }, orders: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ];

    const result = await Order.aggregate(pipeline);
    return res.json({ period, result });
  } catch (err) {
    console.error("salesReport error:", err);
    return res.status(500).json({ error: err.message });
  }
};

import express from "express";
import mongoose from "mongoose";
import accountSchema from "../models/Transaction.js";

const router = express.Router();



// Get dashboard summary: total transactions, total balance, fraud alerts
router.get("/dashboard/summary", async (req, res) => {
  try {
    const Account = req.currentDB.model("Account", accountSchema, "accounts");
    // Aggregate total transactions and total balance
    const summary = await Account.aggregate([
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: { $size: "$transactions" } },
          totalBalance: { $sum: "$total_balance" }
        }
      }
    ]);
    // For fraud alerts, you may want to count flagged transactions or use a separate collection
    // Here, we just return 0 as a placeholder
    res.json({
      totalTransactions: summary[0]?.totalTransactions || 0,
      totalBalance: summary[0]?.totalBalance || 0,
      fraudAlerts: 0 // You can update this if you have a fraud flag
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching dashboard summary" });
  }
});

// Get last 10 transactions from currentDB
router.get("/transactions/latest", async (req, res) => {
  try {
    const Account = req.currentDB.model("Account", accountSchema, "accounts");
    // Aggregate last 10 transactions across all accounts, sorted by timestamp descending
    const results = await Account.aggregate([
      { $unwind: "$transactions" },
      { $sort: { "transactions.timestamp": -1, "transactions._id": -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          account_number: 1,
          customer_name: 1,
          transaction_id: "$transactions.transaction_id",
          timestamp: "$transactions.timestamp",
          amount: "$transactions.amount",
          status: "$transactions.status",
          payment_method: "$transactions.payment_method"
        }
      }
    ]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching latest transactions" });
  }
});

// Fetch account details by account number (from currentDB)
router.get("/:accountNumber", async (req, res) => {
  try {
    const { accountNumber } = req.params;
    // Use the currentDB connection for the Account model
    const Account = req.currentDB.model("Account", accountSchema, "accounts");
    const account = await Account.findOne({ account_number: accountNumber });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: "Error fetching account details" });
  }
});

export default router;

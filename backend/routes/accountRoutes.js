import express from "express";
import Account from "../models/Transaction.js";

const router = express.Router();

// Fetch account details by account number
router.get("/:accountNumber", async (req, res) => {
  try {
    const { accountNumber } = req.params;
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

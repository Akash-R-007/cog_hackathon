import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  account_number: String,
  customer_name: String,
  total_transactions: Number,
  total_balance: Number,
  transactions: [{
    transaction_id: String,
    timestamp: String,
    amount: Number,
    currency: String,
    merchant: String,
    merchant_category: String,
    location: String,
    payment_method: String,
    status: String,
    transaction_type: String,
    balance_after_transaction: Number,
    ip_address: String
  }]
});

export default mongoose.model("Account", transactionSchema, "accounts");

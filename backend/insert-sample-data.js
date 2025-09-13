// Sample data insertion script for testing
import mongoose from "mongoose";

// Account Schema
const accountSchema = new mongoose.Schema({
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

const Account = mongoose.model("Account", accountSchema, "accounts");

// Sample account data matching your structure
const sampleAccount = {
  "account_number": "123456789012345",
  "customer_name": "Ravi Kumar",
  "total_transactions": 12,
  "total_balance": 65780.45,
  "transactions": [
    {
      "transaction_id": "d6f8-9c23-8d72",
      "timestamp": "2025-03-10T15:23:00",
      "amount": 1200.50,
      "currency": "INR",
      "merchant": "Reliance Retail",
      "merchant_category": "Grocery",
      "location": "Chennai",
      "payment_method": "UPI",
      "status": "Success",
      "transaction_type": "Debit",
      "balance_after_transaction": 64579.95,
      "ip_address": "103.27.54.89"
    },
    {
      "transaction_id": "a1b2-c3d4-e5f6",
      "timestamp": "2025-03-08T10:15:00",
      "amount": 5000.00,
      "currency": "INR",
      "merchant": "Amazon India",
      "merchant_category": "Online Shopping",
      "location": "Bangalore",
      "payment_method": "Credit Card",
      "status": "Success",
      "transaction_type": "Debit",
      "balance_after_transaction": 65780.45,
      "ip_address": "103.27.54.90"
    },
    {
      "transaction_id": "x7y8-z9a0-b1c2",
      "timestamp": "2025-03-05T14:30:00",
      "amount": 75000.00,
      "currency": "INR",
      "merchant": "Salary Credit",
      "merchant_category": "Salary",
      "location": "Mumbai",
      "payment_method": "Bank Transfer",
      "status": "Success",
      "transaction_type": "Credit",
      "balance_after_transaction": 70780.45,
      "ip_address": "103.27.54.91"
    }
  ]
};

async function insertSampleData() {
  try {
    console.log("🔍 Connecting to MongoDB...");
    
    await mongoose.connect("mongodb://127.0.0.1:27017/bankDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB successfully!");
    
    // Check if account already exists
    const existingAccount = await Account.findOne({ account_number: "123456789012345" });
    
    if (existingAccount) {
      console.log("⚠️ Sample account already exists!");
    } else {
      // Insert sample account
      const newAccount = new Account(sampleAccount);
      await newAccount.save();
      console.log("✅ Sample account inserted successfully!");
    }
    
    console.log("\n📋 Current accounts in database:");
    const allAccounts = await Account.find({}, { account_number: 1, customer_name: 1, total_balance: 1 });
    allAccounts.forEach(acc => {
      console.log(`   - ${acc.account_number} (${acc.customer_name}) - ₹${acc.total_balance?.toLocaleString()}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

console.log("🏦 Sample Data Insertion Script");
console.log("================================");
insertSampleData();
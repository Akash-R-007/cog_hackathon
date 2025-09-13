// Test script to check MongoDB connection and account lookup
import mongoose from "mongoose";

// MongoDB Schema matching your accounts collection structure
const accountSchema = new mongoose.Schema({
  account_number: String,
  customer_name: String,
  total_transactions: Number,
  total_balance: Number,
  transactions: [{
    transaction_id: String,
    timestamp: String, // ISO Date String
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

const Account = mongoose.model("Account", accountSchema, "accounts"); // Use "accounts" collection

async function testAccount(accountNumber) {
  try {
    console.log("🔍 Connecting to MongoDB...");
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/bankDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB successfully!");
    
    // Test account lookup
    console.log(`\n🔍 Looking for account: ${accountNumber}`);
    
    const account = await Account.findOne({ account_number: accountNumber });
    
    if (!account) {
      console.log("❌ Account not found!");
      
      // Let's see what accounts exist
      console.log("\n📋 Available accounts in database:");
      const allAccounts = await Account.find({}, { account_number: 1, customer_name: 1 });
      if (allAccounts.length === 0) {
        console.log("   No accounts found in database");
      } else {
        allAccounts.forEach(acc => {
          console.log(`   - ${acc.account_number} (${acc.customer_name})`);
        });
      }
    } else {
      console.log("✅ Account found!");
      console.log("\n📊 Account Details:");
      console.log(`   Customer: ${account.customer_name}`);
      console.log(`   Account: ${account.account_number}`);
      console.log(`   Total Transactions: ${account.total_transactions}`);
      console.log(`   Total Balance: ₹${account.total_balance?.toLocaleString()}`);
      console.log(`   Transactions in array: ${account.transactions?.length || 0}`);
      
      if (account.transactions && account.transactions.length > 0) {
        console.log("\n💳 Recent Transactions:");
        account.transactions.slice(0, 3).forEach((txn, index) => {
          console.log(`   ${index + 1}. ${txn.transaction_type} of ₹${txn.amount} at ${txn.merchant} on ${new Date(txn.timestamp).toLocaleDateString()}`);
        });
        if (account.transactions.length > 3) {
          console.log(`   ... and ${account.transactions.length - 3} more transactions`);
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Get account number from command line argument or use default
const accountNumber = process.argv[2] || "281668399176270";
console.log("hello")
console.log("🏦 Bank Account Lookup Test");
console.log(accountNumber);

console.log("============================");
testAccount(accountNumber);
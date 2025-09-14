// reset.js
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/bankDB";
const keepCount = 100;

const accountSchema = new mongoose.Schema({}, { strict: false });
const Account = mongoose.model("Account", accountSchema, "accounts");

async function resetAccounts() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to bankDB");

    // Get _id of the 100 oldest accounts
    const keepDocs = await Account.find({}, { _id: 1 }).sort({ _id: 1 }).limit(keepCount);
    const keepIds = keepDocs.map(doc => doc._id);

    // Delete all accounts NOT in keepIds
    const result = await Account.deleteMany({ _id: { $nin: keepIds } });
    console.log(`Deleted ${result.deletedCount} accounts. Only ${keepCount} remain.`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from bankDB");
  }
}

resetAccounts();
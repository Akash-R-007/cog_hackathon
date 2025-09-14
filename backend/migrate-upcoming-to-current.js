// Script to move transactions from upcomingDB to currentDB

import mongoose from "mongoose";
import { WebSocket } from 'ws';

// Connection URIs
const CURRENT_DB_URI = "mongodb://127.0.0.1:27017/bankDB";
const UPCOMING_DB_URI = "mongodb://127.0.0.1:27017/upcomingDB";

// Schemas (should match your main schema)
const transactionSchema = new mongoose.Schema({
  account_number: String,
  customer_name: String,
  total_transactions: Number,
  total_balance: Number,
  transactions: [
    {
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
      ip_address: String,
    },
  ],
});


// Persistent WebSocket connection
let ws = null;
function connectWebSocket() {
  ws = new WebSocket('ws://localhost:5050');
  ws.on('open', () => {
    console.log('Connected to fraud alert WebSocket server');
  });
  ws.on('close', () => {
    console.log('WebSocket closed, reconnecting in 2s...');
    setTimeout(connectWebSocket, 2000);
  });
  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    ws.close();
  });
}
connectWebSocket();

async function migrateOne() {
  try {
    // Connect to both DBs
    const currentDB = await mongoose.createConnection(CURRENT_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const upcomingDB = await mongoose.createConnection(UPCOMING_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const UpcomingAccount = upcomingDB.model("Account", transactionSchema, "accounts");
    const CurrentAccount = currentDB.model("Account", transactionSchema, "accounts");

    // Get one account from upcomingDB
    const account = await UpcomingAccount.findOne();
    if (!account) {
      console.log("No more accounts to migrate.");
      await currentDB.close();
      await upcomingDB.close();
      // Wait and return, let the loop continue
      return;
    }

    // For each transaction in the account, check for fraud
    const { spawnSync } = await import('child_process');
    let isFraud = false;
    for (const txn of account.transactions) {
      // Call Python script with transaction as JSON
      const py = spawnSync('python', [
        './backend/predict_fraud.py'
      ], {
        input: JSON.stringify(txn),
        encoding: 'utf-8'
      });
      if (py.error) {
        console.error('Error running fraud detection:', py.error);
        continue;
      }
      const result = py.stdout.trim();
      if (result === '1') {
        isFraud = true;
        console.log(`🚨 Fraud detected in account ${account.account_number}, transaction ${txn.transaction_id}`);
        // Send fraud alert to WebSocket server
        if (ws && ws.readyState === 1) {
          ws.send(JSON.stringify({
            type: 'fraud_alert',
            account_number: account.account_number,
            transaction_id: txn.transaction_id,
            amount: txn.amount,
            customer_name: account.customer_name
          }));
        }
        break;
      }
    }

    if (!isFraud) {
      // Insert into currentDB
      await CurrentAccount.create(account.toObject());
      // Remove from upcomingDB
      await UpcomingAccount.deleteOne({ _id: account._id });
      console.log(`Migrated account ${account.account_number}`);
      // Send WebSocket message for each transaction migrated
      if (ws && ws.readyState === 1) {
        for (const txn of account.transactions) {
          ws.send(JSON.stringify({
            type: 'transaction_migrated',
            transaction: {
              account_number: account.account_number,
              customer_name: account.customer_name,
              transaction_id: txn.transaction_id,
              timestamp: txn.timestamp,
              amount: txn.amount,
              status: txn.status,
              payment_method: txn.payment_method
            }
          }));
        }
      }
    } else {
      // Optionally, you can remove or flag the account in upcomingDB
      console.log(`Account ${account.account_number} NOT migrated due to fraud.`);
    }

    await currentDB.close();
    await upcomingDB.close();
  } catch (err) {
    console.error('Migration error:', err);
    // Do not exit, just log and continue
  }
}

async function migrateLoop() {
  while (true) {
    await migrateOne();
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

migrateLoop();
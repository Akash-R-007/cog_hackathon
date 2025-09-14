import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connections
const currentDB = mongoose.createConnection("mongodb://127.0.0.1:27017/bankDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const upcomingDB = mongoose.createConnection("mongodb://127.0.0.1:27017/upcomingDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Pass DB connections to routes if needed
app.use((req, res, next) => {
  req.currentDB = currentDB;
  req.upcomingDB = upcomingDB;
  next();
});

// Routes
app.use("/api/accounts", accountRoutes);

// Server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
  console.log("Connected to currentDB (bankDB) and upcomingDB (upcomingDB)");
});

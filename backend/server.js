import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/bankDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api/accounts", accountRoutes);

// Server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

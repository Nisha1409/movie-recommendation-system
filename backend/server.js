import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Test Root Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});


// DB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(`✅ Connected to DB`))
    .catch((err) => console.log(`❌ DB Connection Failed: ${err}`));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

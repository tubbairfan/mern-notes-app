import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // allow React app
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/note.js";

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

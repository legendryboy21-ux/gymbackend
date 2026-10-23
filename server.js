const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// Direct MongoDB Connection Link
const MONGO_URI = "mongodb+srv://legendryboy21_db_user:ADEEL1212@cluster0.ve6alc1.mongodb.net/shahid_gym?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Database Schema
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false },
  goal: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model("Lead", leadSchema);

// Transporter dummy pass pe crash na kare
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gym@gmail.com",
    pass: "dummy_pass",
  },
});

// Lead Submission API
app.post("/api/free-trial", async (req, res) => {
  try {
    const { name, phone, email, goal } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name aur phone zaroori hain!" });
    }

    const newLead = new Lead({ name, phone, email, goal });
    await newLead.save();

    console.log("🔥 Naya Client Data Save Ho Gaya MongoDB Mein:", { name, phone, goal });

    res.status(200).json({ success: true, message: "Lead saved successfully!" });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, message: "Server error, dobara koshish karein." });
  }
});

app.get("/", (req, res) => {
  res.send("Shahid Gym Backend Server is Running!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chal raha hai port ${PORT} par`);
});
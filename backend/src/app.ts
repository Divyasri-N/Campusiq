import express from "express";
import cors from "cors";

import College from "./models/College";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campusiq-search.netlify.app"  // ← fixed URL
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CampusIQ Backend Running");
});

/* GET ALL COLLEGES FROM MONGODB */
app.get("/api/colleges", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* GET SINGLE COLLEGE BY _id */
app.get("/api/colleges/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        message: "College not found",
      });
    }

    res.json(college);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default app;
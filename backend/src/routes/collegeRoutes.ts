import express from "express";
import College from "../models/College";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();

    res.json(colleges);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch colleges",
    });
  }
});

module.exports = router;
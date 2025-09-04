import express from "express";
import axios from "axios";

const router = express.Router();

const VERCEL_ANALYTICS_TOKEN = "VKIv2CJK6FiJ8Q39DYtU8kis";
const VERCEL_PROJECT_ID = "shangproperties"; // Change if needed

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.vercel.com/v6/analytics/reports?projectId=${VERCEL_PROJECT_ID}&period=7d`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_ANALYTICS_TOKEN}`,
        },
      }
    );
    console.log("Vercel Analytics API response:", response.data); // <-- Add this line
    res.json(response.data);
  } catch (err) {
    console.error("Vercel Analytics API error:", err?.response?.data || err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;

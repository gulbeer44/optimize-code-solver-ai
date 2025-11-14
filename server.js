// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");

// Fix node-fetch (ESM import inside CommonJS)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// Middleware
app.use(express.json());

// Serve frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// API Route
app.post("/api/optimize", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("📨 Sending request to Lyzr agent...");

    const response = await fetch(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_API_KEY, // stored securely in Render
        },
        body: JSON.stringify({
          user_id: "gulbeersinghchauhan444@gmail.com",
          agent_id: "6916c77ec2538288e2760b31",
          session_id: "6916c77ec2538288e2760b31-websession",
          message: message,
        }),
      }
    );

    const data = await response.json();

    console.log("✅ Lyzr response received");

    res.json(data);
  } catch (error) {
    console.error("❌ ERROR talking to Lyzr:", error);
    res.status(500).json({ error: "Server error while contacting AI agent" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

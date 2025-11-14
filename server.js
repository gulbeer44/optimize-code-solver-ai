// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

// Enable JSON
app.use(express.json());

// Serve static frontend (index.html)
app.use(express.static(path.join(__dirname, "public")));

// API route
app.post("/api/optimize", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Node 20+ has native fetch — no need for node-fetch
    const lyzrResponse = await fetch(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_API_KEY,
        },
        body: JSON.stringify({
          user_id: "gulbeersinghchauhan444@gmail.com",
          agent_id: "6916c77ec2538288e2760b31",
          session_id: "6916c77ec2538288e2760b31-websession",
          message,
        }),
      }
    );

    const data = await lyzrResponse.json();
    res.json(data);

  } catch (error) {
    console.error("❌ LYZR API ERROR:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 🚀 Render requires this PORT handling
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on PORT: ${PORT}`);
});

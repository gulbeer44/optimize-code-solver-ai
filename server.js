require("dotenv").config();
const express = require("express");
const path = require("path");

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/optimize", async (req, res) => {
  const { message } = req.body;

  try {
    const reply = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: "gulbeersinghchauhan444@gmail.com",
        agent_id: "6916c77ec2538288e2760b31",
        session_id: "6916c77ec2538288e2760b31-websession",
        message
      })
    });

    const data = await reply.json();
    res.json(data);

  } catch (err) {
    res.json({ error: "Server error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

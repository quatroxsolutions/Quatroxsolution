const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();

// IMPORTANT middleware
app.use(express.json()); // 👈 THIS WAS MISSING
app.use(express.static(path.join(__dirname, "public")));

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.json({ reply: "Error connecting to AI" });
  }
});

// Home page route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(process.env.PORT || 5000, () =>
  console.log("🚀 Server running at http://localhost:5000")
);

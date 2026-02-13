const express = require("express");
<<<<<<< HEAD
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
=======
const cors = require("cors");
const fetch = require("node-fetch");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const knowledge = fs.readFileSync("knowledge.txt", "utf8");

app.get("/", (req, res) => {
  res.send("Quatro AI running (FREE LOCAL AI)");
});

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message.toLowerCase();

    const contactHTML = `
<p>Contact us:</p>
<a href="tel:+917200801765">+91 72008 01765</a><br>
<a href="mailto:contact@quatroxsolutions.com">contact@quatroxsolutions.com</a>
`;

    let showContact =
      userMsg.includes("contact") ||
      userMsg.includes("phone") ||
      userMsg.includes("call") ||
      userMsg.includes("email") ||
      userMsg.includes("reach");

    const fullPrompt = `
You are Quatro, the AI chatbot of Quatro BPO Services.

Business info:
${knowledge}

Customer question:
${userMsg}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3",
        prompt: fullPrompt,
        stream: false
      })
    });

    const data = await response.json();

    let aiReply = data.response
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    res.json({
      reply: aiReply,
      contact: showContact ? contactHTML : ""
    });

  } catch (err) {
    console.log(err);
    res.json({ reply: "AI not running. Start Ollama." });
  }
});

app.listen(5000, () => {
  console.log("🚀 Quatro AI running at http://localhost:5000");
});
>>>>>>> ac7bce68e15db4a4c62c357df8edd0967662a707

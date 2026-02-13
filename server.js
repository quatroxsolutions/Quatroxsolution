const express = require("express");
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

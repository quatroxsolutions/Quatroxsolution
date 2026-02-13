async function sendMessage() {
    const input = document.getElementById("message");
    const chatBox = document.getElementById("chatBox");

    const userMessage = input.value;
    if (!userMessage) return;

    chatBox.innerHTML += `<div class="user">You: ${userMessage}</div>`;
    input.value = "";

    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div class="bot">Bot: ${data.reply}</div>`;
}

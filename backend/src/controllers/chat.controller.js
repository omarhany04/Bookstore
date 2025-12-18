function stripMarkdown(text) {
  if (!text) return text;

  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#+\s*/g, "")
    .replace(/>\s*/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "Missing message" });
    }

    const baseUrl = process.env.OLLAMA_BASE_URL || "http://ollama:11434";
    const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

    const systemPrompt = `
You are "Booky Assistant", a helpful bookstore assistant for the Booky web app.

Rules:
Do NOT use markdown.
Do NOT use asterisks, bullet points, or numbered lists.
Respond in plain text sentences only.
Keep answers concise, friendly, and practical.

You help users browse books, understand categories, recommend books, manage cart and checkout, and understand admin features.
`.trim();

    const url = `${baseUrl.replace(/\/$/, "")}/api/chat`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: String(message) },
        ],
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      const errMsg = data?.error || `Ollama request failed (${r.status})`;
      return res.status(400).json({ message: errMsg });
    }

    const rawText = data?.message?.content || "No response received.";
    const cleanText = stripMarkdown(rawText);

    res.json({ reply: cleanText });
  } catch (e) {
    next(e);
  }
};

const { handleChatRequest } = require("../utils/bookyChat");

const CONNECTION_ERROR_TEXT =
  "I can help with Booky books, categories, cart, checkout, orders, quizzes, and admin features. Try asking for recommendations, payment help, or reports.";

function parseRequestBody(body) {
  if (!body) return {};

  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
}

exports.chat = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const result = await handleChatRequest(parseRequestBody(req.body));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: CONNECTION_ERROR_TEXT,
    });
  }
};

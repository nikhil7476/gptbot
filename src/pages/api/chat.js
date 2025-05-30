import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in environment variables.");
}
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: "Message is required and must be a string." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "Invalid response from OpenAI" });
    }

    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.response) {
      const status = error.response.status || 500;
      const errorData = error.response.data;

      if (status === 429) {
        return res.status(429).json({
          error:
            "OpenAI quota exceeded. Please try again later or check your API usage.",
        });
      }
      console.error("Error details:", errorData);
      res.status(status).json({ error: errorData });
    } else {
      res.status(500).json({ error: "OpenAI API request failed" });
    }
  }
}

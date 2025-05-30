// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).end();
//   }

//   const { message } = req.body;

//   try {
//     const completion = await openai.createChatCompletion({
//       model: "gpt-4",
//       messages: [{ role: "user", content: message }],
//     });

//     res
//       .status(200)
//       .json({ response: completion.data.choices[0].message.content });
//   } catch (error) {
//     res.status(500).json({ error: "Error generating response" });
//   }
// }

// pages/api/chat.js

import OpenAI from "openai";

// Initialize OpenAI instance using the secret key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  // Basic validation
  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: "Message is required and must be a string." });
  }

  try {
    // Create chat completion using OpenAI GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    // Extract and send response
    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "No response received.";
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // Handle known OpenAI API errors gracefully
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Error generating response from OpenAI" });
    }
  }
}

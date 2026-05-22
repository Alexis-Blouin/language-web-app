const express = require("express");
const router = express.Router();
const openAI = require("openai");

// Using API key from https://github.com/alistaitsacle/free-llm-api-keys
const client = new openAI({
  baseURL: "https://aiapiv2.pekpik.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/analyze", async (req, res) => {
  try {
    const { sentence, question } = req.body;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: `
You are a Chinese teacher and you give feedback in English.

Analyze this sentence:
"${sentence}"

Answer this question if there is one:
"${question}"

Return JSON:
{
 "corrected":"",
 "grammar_feedback":[],
 "vocabulary_feedback":[],
 "score":0,
 "explanation":[],
 "question_answer":[]
}
`,
        },
      ],
    });

    console.log(response.choices[0].message.content);

    res.json(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const openAI = require("openai");
const db = require("../db");
const authenticate = require("../middleware/authenticate");

// Using API key from https://console.groq.com
const client = new openAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/analyze", async (req, res) => {
  try {
    const { text, question } = req.body;

    // TODO before sending request, check if same text and question as been ak before

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: `
You are a Chinese teacher and you give feedback in English.

Analyze this text:
"${text}"

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

    res.json(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get("/get", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `select queryId, originalText, question, correctedText, grammarFeedback, vocabularyFeedback, explanation, answer, score
      from aiqueries where accountId = ?`,
      [req.accountId],
    );
    // TODO parse grammarFeedback, vocabularyFeedback, explanation and answer
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", authenticate, async (req, res) => {
  try {
    const originalText = req.body.originalText;
    const question = req.body.question;
    const correctedText = req.body.correctedText;
    const grammarFeedback = JSON.stringify(req.body.grammarFeedback);
    const vocabularyFeedback = JSON.stringify(req.body.vocabularyFeedback);
    const explanation = JSON.stringify(req.body.explanation);
    const answer = JSON.stringify(req.body.answer);
    const score = req.body.score;

    const [queriesResult] = await db.query(
      `insert into aiqueries (accountId, originalText, question, correctedText,
      grammarFeedback, vocabularyFeedback, explanation, answer, score)
      values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.accountId,
        originalText,
        question,
        correctedText,
        grammarFeedback,
        vocabularyFeedback,
        explanation,
        answer,
        score,
      ],
    );
    res.json({
      noteId: queriesResult.insertId,
      success: true,
      message: "Query added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

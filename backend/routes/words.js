const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const sql = `select 
      w.WordID,
      w.Hanzi,
      w.Pinyin,
      t.TranslationID,
      t.Meaning,
      c.ChapterID,
      c.ChapterName
    from words w
    join wordtranslations wt on w.WordID = wt.WordID
    join translations t on wt.TranslationID = t.TranslationID
    join chapters c on c.ChapterID = w.chapterID;`;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { Hanzi, Pinyin, ChapterID, Meaning } = req.body;
    console.log(Hanzi, Pinyin, ChapterID, Meaning);

    await db.beginTransaction();

    const [wordResult] = await db.query(
      `insert into words (Hanzi, Pinyin, ChapterID)
      values (?, ?, ?);`,
      [Hanzi, Pinyin, ChapterID],
    );
    const wordId = wordResult.insertId;

    const [translationResult] = await db.query(
      `insert into translations (Meaning)
      values (?)`,
      [Meaning],
    );
    const translationId = translationResult.insertId;

    await db.query(
      `INSERT INTO wordtranslations (WordID, TranslationID)
      VALUES (?, ?)`,
      [wordId, translationId],
    );

    await db.commit();

    res.json({ message: "Word added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

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
      c.ChapterName,
      wt.WordTranslationID
    from words w
    join wordtranslations wt on w.WordID = wt.WordID
    join translations t on wt.TranslationID = t.TranslationID
    join chapters c on c.ChapterID = w.chapterID
    order by c.ChapterID, w.WordID;`;
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

    await db.beginTransaction();

    // Verify that the word we currently are adding does not already exists in the same chapter
    const [wordSearchResult] = await db.query(
      `select WordID from words
      where Hanzi = ? AND ChapterID = ?`,
      [Hanzi, ChapterID],
    );

    let wordId;

    if (wordSearchResult.length > 0) {
      wordId = wordSearchResult[0].WordID;
    } else {
      const [wordResult] = await db.query(
        `insert into words (Hanzi, Pinyin, ChapterID)
      values (?, ?, ?);`,
        [Hanzi, Pinyin, ChapterID],
      );

      wordId = wordResult.insertId;
    }

    // Verify that the meaning we currently are adding does not already exists
    const [meaningSearchResult] = await db.query(
      `select TranslationID from translations
      where Meaning = ?`,
      [Meaning],
    );

    let translationId;

    if (meaningSearchResult.length > 0) {
      translationId = meaningSearchResult[0].TranslationID;
    } else {
      const [translationResult] = await db.query(
        `insert into translations (Meaning)
      values (?)`,
        [Meaning],
      );
      translationId = translationResult.insertId;
    }

    // Inserts the key pair for the word and it's translation
    await db.query(
      `INSERT INTO wordtranslations (WordID, TranslationID)
      VALUES (?, ?)`,
      [wordId, translationId],
    );

    await db.commit();

    res.json({
      message: "Word added successfully",
      wordId: wordId,
      translationId: translationId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    // .query here since it's delete and not post
    const WordID = req.query.WordID;
    const TranslationID = req.query.TranslationID;

    await db.beginTransaction();

    // Delete the pair
    await db.query(
      `DELETE FROM wordtranslations 
      WHERE WordID = ? AND TranslationID = ?`,
      [WordID, TranslationID],
    );

    // Possibly delete the word
    await maybeDeleteWord(WordID);
    // Possibly delete the translation
    await maybeDeleteTranslation(TranslationID);

    await db.commit();

    res.json({ message: "Pair deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.patch("/modify", async (req, res) => {
  try {
    const {
      wordId,
      translationId,
      newHanzi,
      newPinyin,
      newChapterId,
      newMeaning,
      wordTranslationId,
    } = req.body;
    // Check if new word/translation exists
    const newWord = await selectOneWord(newHanzi, newPinyin, newChapterId);
    let newWordId;
    const newTranslation = await selectOneTranslation(newMeaning);
    let newTranslationId;
    await db.beginTransaction();
    // Creates a new word and/or translation if they don't exist
    if (newWord === null) {
      const [result] = await db.query(
        `insert into words (Hanzi, Pinyin, ChapterID)
      values (?, ?, ?)`,
        [newHanzi, newPinyin, newChapterId],
      );
      newWordId = result.insertId;
    } else {
      newWordId = newWord.WordID;
    }
    if (newTranslation === null) {
      [result] = await db.query(
        `insert into translations (Meaning)
      values (?)`,
        [newMeaning],
      );
      newTranslationId = result.insertId;
    } else {
      newTranslationId = newTranslation.TranslationID;
    }
    // Update the link table with new Ids
    if (wordId !== newWordId) {
      await db.query(
        `update wordtranslations
      set WordID = ?
      where WordTranslationID = ?`,
        [newWordId, wordTranslationId],
      );
      // Check to maybe delete the word
      await maybeDeleteWord(wordId);
    }
    if (translationId !== newTranslationId) {
      await db.query(
        `update wordtranslations
      set TranslationID = ?
      where WordTranslationID = ?`,
        [newTranslationId, wordTranslationId],
      );
      // Check to maybe delete the translation
      await maybeDeleteTranslation(translationId);
    }

    await db.commit();

    res.json({
      message: "Word modified successfully",
      wordId: wordId,
      translationId: translationId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneWord(hanzi, pinyin, chapterId) {
  try {
    const [result] = await db.query(
      `select WordID from words
      where Hanzi = ? AND Pinyin = ? AND ChapterID = ?`,
      [hanzi, pinyin, chapterId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function selectOneTranslation(meaning) {
  try {
    const [result] = await db.query(
      `select TranslationID from translations
      where Meaning = ?`,
      [meaning],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function maybeDeleteWord(wordId) {
  try {
    await db.query(
      `DELETE FROM words 
      WHERE WordID = ?
      AND NOT EXISTS (
        SELECT 1 FROM wordtranslations WHERE WordID = ?
      );`,
      [wordId, wordId],
    );
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function maybeDeleteTranslation(translationId) {
  try {
    await db.query(
      `DELETE FROM translations 
      WHERE TranslationID = ?
      AND NOT EXISTS (
        SELECT 1 FROM wordtranslations WHERE TranslationID = ?
      );`,
      [translationId, translationId],
    );
  } catch (err) {
    console.error(err);
    return {};
  }
}

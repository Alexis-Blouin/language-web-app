const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    // .query here since it's get and not post
    const WordTypeId = req.query.WordTypeId ?? 1;

    const sql = `select 
      w.WordId,
      w.Hanzi,
      w.Pinyin,
      w.TypeId,
      t.TranslationId,
      t.Translation,
      c.ChapterId,
      c.ChapterName,
      wt.WordTranslationId
    from words w
    join wordtranslations wt on w.WordId = wt.WordId
    join translations t on wt.TranslationId = t.TranslationId
    join chapters c on c.ChapterId = w.chapterId
    where w.TypeId = ${WordTypeId}
    order by c.ChapterId, w.WordId;`;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { Hanzi, Pinyin, ChapterId, Translation, TypeId } = req.body;

    await db.beginTransaction();

    // Verify that the word we currently are adding does not already exists in the same chapter
    const [wordSearchResult] = await db.query(
      `select WordId from words
      where Hanzi = ? AND ChapterId = ? AND TypeId = ?`,
      [Hanzi, ChapterId, TypeId],
    );

    let wordId;

    if (wordSearchResult.length > 0) {
      wordId = wordSearchResult[0].WordId;
    } else {
      const [wordResult] = await db.query(
        `insert into words (Hanzi, Pinyin, ChapterId, TypeId)
      values (?, ?, ?, ?);`,
        [Hanzi, Pinyin, ChapterId, TypeId],
      );

      wordId = wordResult.insertId;
    }

    // Verify that the translation we currently are adding does not already exists
    const [translationSearchResult] = await db.query(
      `select TranslationId from translations
      where Translation = ?`,
      [Translation],
    );

    let translationId;

    if (translationSearchResult.length > 0) {
      translationId = translationSearchResult[0].TranslationId;
    } else {
      const [translationResult] = await db.query(
        `insert into translations (Translation)
      values (?)`,
        [Translation],
      );
      translationId = translationResult.insertId;
    }

    // Inserts the key pair for the word and it's translation
    await db.query(
      `INSERT INTO wordtranslations (WordId, TranslationId)
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
    const WordId = req.query.WordId;
    const TranslationId = req.query.TranslationId;

    await db.beginTransaction();

    // Delete the pair
    await db.query(
      `DELETE FROM wordtranslations 
      WHERE WordId = ? AND TranslationId = ?`,
      [WordId, TranslationId],
    );

    // Possibly delete the word
    await maybeDeleteWord(WordId);
    // Possibly delete the translation
    await maybeDeleteTranslation(TranslationId);

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
      newTranslation,
      wordTranslationId,
      typeId,
    } = req.body;
    // Check if new word/translation exists
    const wordSelect = await selectOneWord(
      newHanzi,
      newPinyin,
      newChapterId,
      typeId,
    );
    let newWordId;
    const translationSelect = await selectOneTranslation(newTranslation);
    let newTranslationId;
    await db.beginTransaction();
    // Creates a new word and/or translation if they don't exist
    if (wordSelect === null) {
      const [result] = await db.query(
        `insert into words (Hanzi, Pinyin, ChapterId, TypeId)
      values (?, ?, ?, ?)`,
        [newHanzi, newPinyin, newChapterId, typeId],
      );
      newWordId = result.insertId;
    } else {
      newWordId = wordSelect.WordId;
    }
    if (translationSelect === null) {
      [result] = await db.query(
        `insert into translations (Translation)
      values (?)`,
        [newTranslation],
      );
      newTranslationId = result.insertId;
    } else {
      newTranslationId = translationSelect.TranslationId;
    }
    // Update the link table with new Ids
    if (wordId !== newWordId) {
      await db.query(
        `update wordtranslations
      set WordId = ?
      where WordTranslationId = ?`,
        [newWordId, wordTranslationId],
      );
      // Check to maybe delete the word
      await maybeDeleteWord(wordId);
    }
    if (translationId !== newTranslationId) {
      await db.query(
        `update wordtranslations
      set TranslationId = ?
      where WordTranslationId = ?`,
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

async function selectOneWord(hanzi, pinyin, chapterId, typeId) {
  try {
    const [result] = await db.query(
      `select WordId from words
      where Hanzi = ? AND Pinyin = ? AND ChapterId = ? AND TypeId = ?`,
      [hanzi, pinyin, chapterId, typeId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function selectOneTranslation(translation) {
  try {
    const [result] = await db.query(
      `select TranslationId from translations
      where Translation = ?`,
      [translation],
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
      WHERE WordId = ?
      AND NOT EXISTS (
        SELECT 1 FROM wordtranslations WHERE WordId = ?
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
      WHERE TranslationId = ?
      AND NOT EXISTS (
        SELECT 1 FROM wordtranslations WHERE TranslationId = ?
      );`,
      [translationId, translationId],
    );
  } catch (err) {
    console.error(err);
    return {};
  }
}

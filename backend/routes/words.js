const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middleware/authenticate");

router.get("/get", authenticate, async (req, res) => {
  try {
    // .query here since it's get and not post
    const wordTypeId = req.query.wordTypeId;

    const sql = `select 
      w.wordId,
      w.hanzi,
      w.pinyin,
      w.typeId,
      t.translationId,
      t.translation,
      ch.chapterId,
      ch.chapterName,
      ca.categoryId,
      ca.categoryName,
      wt.wordTranslationId
    from words w
    join wordtranslations wt on w.wordId = wt.wordId
    join translations t on wt.translationId = t.translationId
    join chapters ch on ch.chapterId = w.chapterId
    join categories ca on ca.categoryId = w.categoryId
    where w.typeId = ? and wt.accountId = ?
    order by ch.chapterId, w.hanzi;`;
    const [rows] = await db.query(sql, [wordTypeId, req.accountId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", authenticate, async (req, res) => {
  // Trim words before adding to database to avoid issues with duplicates and searching
  try {
    const { hanzi, pinyin, chapterId, categoryId, translation, typeId } =
      req.body;

    await db.beginTransaction();

    // Verify that the word we currently are adding does not already exists in the same chapter
    const [wordSearchResult] = await db.query(
      `select wordId from words
      where hanzi = ? AND chapterId = ? AND typeId = ?`,
      [hanzi, chapterId, typeId],
    );

    let wordId;

    if (wordSearchResult.length > 0) {
      wordId = wordSearchResult[0].wordId;
    } else {
      const [wordResult] = await db.query(
        `insert into words (hanzi, pinyin, chapterId, categoryId, typeId)
      values (?, ?, ?, ?, ?);`,
        [hanzi, pinyin, chapterId, categoryId, typeId],
      );

      wordId = wordResult.insertId;
    }

    // Verify that the translation we currently are adding does not already exists
    const [translationSearchResult] = await db.query(
      `select translationId from translations
      where translation = ?`,
      [translation],
    );

    let translationId;

    if (translationSearchResult.length > 0) {
      translationId = translationSearchResult[0].translationId;
    } else {
      const [translationResult] = await db.query(
        `insert into translations (translation)
      values (?)`,
        [translation],
      );
      translationId = translationResult.insertId;
    }

    // Inserts the key pair for the word and it's translation
    const [wordTranslationResult] = await db.query(
      `INSERT INTO wordtranslations (wordId, translationId, accountId)
      VALUES (?, ?, ?)`,
      [wordId, translationId, req.accountId],
    );
    wordTranslationId = wordTranslationResult.insertId;

    await db.commit();

    res.json({
      message: "Word added successfully",
      wordId: wordId,
      translationId: translationId,
      wordTranslationId: wordTranslationId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete("/delete", authenticate, async (req, res) => {
  try {
    // .query here since it's delete and not post
    const wordId = req.query.wordId;
    const translationId = req.query.translationId;

    await db.beginTransaction();

    // Delete the pair
    await db.query(
      `DELETE FROM wordtranslations 
      WHERE wordId = ? AND translationId = ? AND accountId = ?`,
      [wordId, translationId, req.accountId],
    );

    // Possibly delete the word
    await maybeDeleteWord(wordId, req.accountId);
    // Possibly delete the translation
    await maybeDeleteTranslation(translationId, req.accountId);

    await db.commit();

    res.json({ message: "Pair deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// TODO can't add good and Good. Would be nice to make it case sensitive, but need to modify the table settings I think
router.patch("/modify", authenticate, async (req, res) => {
  try {
    const {
      wordId,
      translationId,
      newHanzi,
      newPinyin,
      newChapterId,
      newCategoryId,
      newTranslation,
      wordTranslationId,
      typeId,
    } = req.body;

    // Check if new word/translation exists
    const wordSelect = await selectOneWord(
      newHanzi,
      newPinyin,
      newChapterId,
      newCategoryId,
      typeId,
    );
    let newWordId;
    const translationSelect = await selectOneTranslation(newTranslation);
    let newTranslationId;
    await db.beginTransaction();

    // Creates a new word and/or translation if they don't exist
    if (wordSelect === null) {
      const [result] = await db.query(
        `insert into words (hanzi, pinyin, chapterId, categoryId, typeId)
      values (?, ?, ?, ?, ?)`,
        [newHanzi, newPinyin, newChapterId, newCategoryId, typeId],
      );
      newWordId = result.insertId;
    } else {
      newWordId = wordSelect.wordId;
    }
    if (translationSelect === null) {
      [result] = await db.query(
        `insert into translations (translation)
      values (?)`,
        [newTranslation],
      );
      newTranslationId = result.insertId;
    } else {
      newTranslationId = translationSelect.translationId;
    }
    // Update the link table with new Ids
    if (wordId !== newWordId) {
      await db.query(
        `update wordtranslations
      set wordId = ?
      where wordTranslationId = ? and accountId = ?`,
        [newWordId, wordTranslationId, req.accountId],
      );
      // Check to maybe delete the word
      await maybeDeleteWord(wordId, req.accountId);
    }
    if (translationId !== newTranslationId) {
      await db.query(
        `update wordtranslations
      set translationId = ?
      where wordTranslationId = ? and accountId = ?`,
        [newTranslationId, wordTranslationId, req.accountId],
      );
      // Check to maybe delete the translation
      await maybeDeleteTranslation(translationId, req.accountId);
    }

    await db.commit();

    res.json({
      message: "Word modified successfully",
      wordId: newWordId,
      translationId: newTranslationId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneWord(hanzi, pinyin, chapterId, newCategoryId, typeId) {
  try {
    const [result] = await db.query(
      `select wordId from words
      where hanzi = ? AND pinyin = ? AND chapterId = ? AND categoryId = ? AND typeId = ?`,
      [hanzi, pinyin, chapterId, newCategoryId, typeId],
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
      `select translationId from translations
      where translation = ?`,
      [translation],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function maybeDeleteWord(wordId, accountId) {
  try {
    await db.query(
      `DELETE FROM words 
      WHERE wordId = ?
      AND NOT EXISTS (
        SELECT 1 FROM wordtranslations WHERE wordId = ? and accountId = ?
      );`,
      [wordId, wordId, accountId],
    );
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function maybeDeleteTranslation(translationId, accountId) {
  try {
    await db.query(
      `DELETE FROM translations 
      WHERE translationId = ?
      AND NOT EXISTS (
        SELECT 1 FROM wordtranslations WHERE translationId = ? and accountId = ?
      );`,
      [translationId, translationId, accountId],
    );
  } catch (err) {
    console.error(err);
    return {};
  }
}

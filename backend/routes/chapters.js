const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middleware/authenticate");

router.get("/get", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `select ChapterId, ChapterName
      from chapters where accountId = ?
      order by ChapterName`,
      [req.accountId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", authenticate, async (req, res) => {
  try {
    const chapterName = req.body.ChapterName;
    const chapter = await selectOneChapter(chapterName, req.accountId);
    if (chapter) {
      res.json({
        chapterId: chapter.ChapterId,
        added: false,
      });
    } else {
      const [chaptersResult] = await db.query(
        `insert into chapters (ChapterName, accountId) values (?, ?)`,
        [chapterName, req.accountId],
      );
      res.json({
        chapterId: chaptersResult.insertId,
        added: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneChapter(chapterName, accountId) {
  try {
    const [result] = await db.query(
      `select ChapterId from chapters
      where ChapterName = ? and accountId = ?`,
      [chapterName, accountId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

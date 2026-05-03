const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query(
      `select ChapterId, ChapterName from chapters order by ChapterName`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const chapterName = req.body.ChapterName;
    const chapter = await selectOneChapter(chapterName);
    if (chapter) {
      res.json({
        chapterId: chapter.ChapterId,
        added: false,
      });
    } else {
      const [chaptersResult] = await db.query(
        `insert into chapters (ChapterName) values (?)`,
        [chapterName],
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

async function selectOneChapter(chapter) {
  try {
    const [result] = await db.query(
      `select ChapterId from chapters
      where ChapterName = ?`,
      [chapter],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

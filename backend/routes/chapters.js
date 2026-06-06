const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middleware/authenticate");

router.get("/get", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `select chapterId, chapterName
      from chapters where accountId = ?
      order by chapterName`,
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
    const accountId = req.accountId;
    const chapterName = req.body.chapterName;
    const chapter = await selectOneChapter(chapterName, accountId);
    if (chapter) {
      res.json({
        chapterId: chapter.chapterId,
        added: false,
      });
    } else {
      const [chaptersResult] = await db.query(
        `insert into chapters (chapterName, accountId) values (?, ?)`,
        [chapterName, accountId],
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

router.post("/update", authenticate, async (req, res) => {
  try {
    const accountId = req.accountId;
    const { chapters } = req.body;

    if (!chapters.length) return res.json({ success: true });

    const ids = chapters.map((c) => c.chapterId);

    const caseStatement = chapters
      .map((c) => `WHEN ${c.chapterId} THEN ?`)
      .join(" ");

    const values = chapters.map((c) => c.chapterName);

    await db.query(
      `UPDATE chapters
      SET chapterName = CASE chapterId ${caseStatement} END
      WHERE chapterId IN (${ids.join(",")})
      AND accountId = ?`,
      [...values, req.accountId],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneChapter(chapterName, accountId) {
  try {
    const [result] = await db.query(
      `select chapterId from chapters
      where chapterName = ? and accountId = ?`,
      [chapterName, accountId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

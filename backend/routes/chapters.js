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
    const [chaptersResult] = await db.query(
      `insert into chapters (ChapterName) values (?)`,
      [req.body.ChapterName],
    );
    res.json(chaptersResult.insertId);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

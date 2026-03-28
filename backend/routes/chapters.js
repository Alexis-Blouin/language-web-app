const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query(
      `select ChapterID, ChapterName from chapters`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const [chapterResult] = await db.query(
      `insert into chapters (ChapterName) values (?)`,
      [req.body.ChapterName],
    );
    res.json(chapterResult.insertId);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

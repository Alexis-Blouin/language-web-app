const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query(
      `select typeId, typeName from wordtypes order by typeId`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const [typesResult] = await db.query(
      `insert into wordtypes (typeName) values (?)`,
      [req.body.typeName],
    );
    res.json(typesResult.insertId);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

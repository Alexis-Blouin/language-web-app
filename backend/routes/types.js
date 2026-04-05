const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query(
      `select TypeId, TypeName from wordtypes order by TypeId`,
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
      `insert into wordtypes (TypeName) values (?)`,
      [req.body.TypeName],
    );
    res.json(typesResult.insertId);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

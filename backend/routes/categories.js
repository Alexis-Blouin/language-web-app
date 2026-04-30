const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query(
      `select CategoryId, CategoryName from categories order by CategoryName`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const [categoriesResult] = await db.query(
      `insert into categories (CategoryName) values (?)`,
      [req.body.CategoryName],
    );
    res.json(categoriesResult.insertId);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

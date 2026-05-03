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
    const categoryName = req.body.CategoryName;
    const category = await selectOneCategory(categoryName);
    if (category) {
      res.json({
        categoryId: category.CategoryId,
        added: false,
      });
    } else {
      const [categoriesResult] = await db.query(
        `insert into categories (CategoryName) values (?)`,
        [req.body.CategoryName],
      );
      res.json({
        categoryId: categoriesResult.insertId,
        added: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneCategory(category) {
  try {
    const [result] = await db.query(
      `select CategoryId from categories
      where CategoryName = ?`,
      [category],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

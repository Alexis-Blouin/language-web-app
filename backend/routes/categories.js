const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middleware/authenticate");

router.get("/get", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `select CategoryId, CategoryName
      from categories where accountId = ?
      order by CategoryName`,
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
    const categoryName = req.body.CategoryName;
    const category = await selectOneCategory(categoryName, req.accountId);
    if (category) {
      res.json({
        categoryId: category.CategoryId,
        added: false,
      });
    } else {
      const [categoriesResult] = await db.query(
        `insert into categories (CategoryName, accountId) values (?, ?)`,
        [req.body.CategoryName, req.accountId],
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

async function selectOneCategory(categoryName, accountId) {
  try {
    const [result] = await db.query(
      `select CategoryId from categories
      where CategoryName = ? and accountId = ?`,
      [categoryName, accountId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

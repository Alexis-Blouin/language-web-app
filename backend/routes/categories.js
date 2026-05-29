const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middleware/authenticate");

router.get("/get", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `select categoryId, categoryName
      from categories where accountId = ?
      order by categoryName`,
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
    const categoryName = req.body.categoryName;
    const category = await selectOneCategory(categoryName, accountId);
    if (category) {
      res.json({
        categoryId: category.categoryId,
        added: false,
      });
    } else {
      const [categoriesResult] = await db.query(
        `insert into categories (categoryName, accountId) values (?, ?)`,
        [categoryName, accountId],
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
      `select categoryId from categories
      where categoryName = ? and accountId = ?`,
      [categoryName, accountId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

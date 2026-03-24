const express = require("express");
const router = express.Router();
const db = require("../db");

// Define a route to fetch all persons from the 'persons' table
router.get("/get", (req, res) => {
  const sql = "select ChapterId, ChapterName from chapters"; // SQL query to select all persons
  db.query(sql, (err, data) => {
    // Execute the SQL query
    if (err) return res.json(err); // If there's an error, return the error
    return res.json(data); // Otherwise, return the data as JSON
  });
});

module.exports = router;

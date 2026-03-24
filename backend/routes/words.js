const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", (req, res) => {
  const sql = `select 
      w.WordID,
      w.Hanzi,
      w.Pinyin,
      t.TranslationID,
      t.Meaning
    from words w
    join wordtranslations wt on w.WordID = wt.WordID
    join translations t on wt.TranslationID = t.TranslationID;`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

module.exports = router;

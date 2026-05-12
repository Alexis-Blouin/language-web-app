const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query(
      `select NoteId, NoteTitle, NoteContent, NoteExample from notes order by NoteTitle`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const noteTitle = req.body.noteTitle;
    const noteContent = req.body.noteContent;
    const noteExample = req.body.noteExample;
    const note = await selectOneNote(noteTitle);
    if (note) {
      res.json({
        noteId: note.NoteId,
        added: false,
      });
    } else {
      const [notesResult] = await db.query(
        `insert into notes (NoteTitle, NoteContent, NoteExample) values (?, ?, ?)`,
        [noteTitle, noteContent, noteExample],
      );
      res.json({
        noteId: notesResult.insertId,
        added: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.patch("/update", async (req, res) => {
  try {
    const noteId = req.body.noteId;
    const noteTitle = req.body.noteTitle;
    const noteContent = req.body.noteContent;
    const noteExample = req.body.noteExample;

    const note = await selectOneNote(noteTitle);
    if (note && note.NoteId !== noteId) {
      res.json({
        updated: false,
      });
    } else {
      await db.query(
        `update notes set NoteTitle = ?, NoteContent = ?, NoteExample = ? where NoteId = ?`,
        [noteTitle, noteContent, noteExample, noteId],
      );
      res.json({
        updated: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneNote(noteTitle) {
  try {
    const [result] = await db.query(
      `select NoteId from notes
      where NoteTitle = ?`,
      [noteTitle],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticate = require("../middleware/authenticate");

router.get("/get", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `select NoteId, NoteTitle, NoteContent, NoteExample
      from notes where accountId = ?
      order by NoteTitle`,
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
    const noteTitle = req.body.noteTitle;
    const noteContent = req.body.noteContent;
    const noteExample = req.body.noteExample;
    const note = await selectOneNote(noteTitle, req.accountId);
    if (note) {
      res.json({
        noteId: note.NoteId,
        success: false,
        message: "Note with the same title already exists",
      });
    } else {
      const [notesResult] = await db.query(
        `insert into notes (NoteTitle, NoteContent, NoteExample, accountId) values (?, ?, ?, ?)`,
        [noteTitle, noteContent, noteExample, req.accountId],
      );
      res.json({
        noteId: notesResult.insertId,
        success: true,
        message: "Note added successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.patch("/update", authenticate, async (req, res) => {
  try {
    const noteId = req.body.noteId;
    const noteTitle = req.body.noteTitle;
    const noteContent = req.body.noteContent;
    const noteExample = req.body.noteExample;

    const note = await selectOneNote(noteTitle, req.accountId);
    if (note && note.NoteId !== noteId) {
      res.json({
        success: false,
        message: "Note with the same title already exists",
      });
    } else {
      await db.query(
        `update notes set NoteTitle = ?, NoteContent = ?, NoteExample = ? where NoteId = ? and accountId = ?`,
        [noteTitle, noteContent, noteExample, noteId, req.accountId],
      );
      res.json({
        success: true,
        message: "Note updated successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete("/delete", authenticate, async (req, res) => {
  try {
    const noteId = req.query.noteId;
    await db.query(`delete from notes where NoteId = ? and accountId = ?`, [
      noteId,
      req.accountId,
    ]);
    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

async function selectOneNote(noteTitle, accountId) {
  try {
    const [result] = await db.query(
      `select NoteId from notes
      where NoteTitle = ? and accountId = ?`,
      [noteTitle, accountId],
    );
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error(err);
    return {};
  }
}

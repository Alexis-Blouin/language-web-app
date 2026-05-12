import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FocusedNote from "./FocusedNote";
import FocusedAddNote from "./AddNote";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = React.useState([]);
  const [openNote, setOpenNote] = React.useState(false);
  const [openAddNote, setOpenAddNote] = React.useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = React.useState(null);
  const handleOpen = (note, index) => {
    setSelectedNote(note);
    setSelectedNoteIndex(index);
    setOpenNote(true);
  };
  const handleOpenAddNote = () => {
    setOpenAddNote(true);
  };
  const handleClose = () => setOpenNote(false);
  const handleCloseAddNote = () => setOpenAddNote(false);
  const [selectedNote, setSelectedNote] = React.useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/notes/get")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const updateNote = (index, updates) => {
    setNotes((prevNotes) =>
      prevNotes.map((note, noteIndex) =>
        noteIndex === index ? { ...note, ...updates } : note,
      ),
    );

    if (index === selectedNoteIndex) {
      setSelectedNote((prevNote) =>
        prevNote ? { ...prevNote, ...updates } : prevNote,
      );
    }
  };

  return (
    <Box sx={{ margin: "16px auto", width: "75%" }}>
      <Grid container spacing={2}>
        {notes.map((note, index) => (
          <Item key={index} note={note} index={index} handleOpen={handleOpen} />
        ))}
        <AddNote handleOpenAddNote={handleOpenAddNote} />
      </Grid>
      <FocusedNote
        note={selectedNote}
        setNotes={setNotes}
        open={openNote}
        handleClose={handleClose}
      />
      <FocusedAddNote
        setNotes={setNotes}
        open={openAddNote}
        handleClose={handleCloseAddNote}
      />
    </Box>
  );
}

export default Notes;

function Item({ note, index, handleOpen }) {
  console.log(note);

  return (
    <Grid size={{ md: 4 }}>
      <Paper
        sx={{ p: 2, cursor: "pointer" }}
        onClick={() => handleOpen(note, index)}
      >
        <Typography variant="h4">{note.NoteTitle}</Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {note.NoteContent.length > 100
            ? note.NoteContent.substring(0, 100) + "..."
            : note.NoteContent}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {note.NoteExample.length > 100
            ? note.NoteExample.substring(0, 100) + "..."
            : note.NoteExample}
        </Typography>
      </Paper>
    </Grid>
  );
}

function AddNote({ handleOpenAddNote }) {
  return (
    <Grid size={{ md: 4 }}>
      <Paper sx={{ p: 2, height: "100%" }}>
        <Typography variant="h4">Add Note</Typography>
        <Button onClick={handleOpenAddNote}>Add</Button>
      </Paper>
    </Grid>
  );
}

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FocusedNote from "./FocusedNote";

function Notes() {
  const [notes, setNotes] = React.useState([]);
  const [openNote, setOpenNote] = React.useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = React.useState(null);
  const handleOpen = (note, index) => {
    setSelectedNote(note);
    setSelectedNoteIndex(index);
    setOpenNote(true);
  };
  const handleClose = () => setOpenNote(false);
  const [selectedNote, setSelectedNote] = React.useState(null);
  useEffect(() => {
    setNotes([
      {
        title: "Note 1",
        content: "This is the content for Note 1.",
      },
      {
        title: "Note 2",
        content: "This is the content for Note 2.",
      },
      {
        title: "Note 3",
        content: "This is the content for Note 3.",
      },
      {
        title: "Note 4",
        content: "This is the content for Note 4.",
      },
    ]);
  }, []);

  const addNote = () => {
    const newNote = {
      title: `Note ${notes.length + 1}`,
      content: `This is the content for Note ${notes.length + 1}.`,
    };
    setNotes([...notes, newNote]);
  };

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
        <AddNote addNote={addNote} />
      </Grid>
      <FocusedNote
        note={selectedNote}
        open={openNote}
        handleClose={handleClose}
        onSave={(updates) => updateNote(selectedNoteIndex, updates)}
      />
    </Box>
  );
}

export default Notes;

function Item({ note, index, handleOpen }) {
  return (
    <Grid size={{ md: 4 }}>
      <Paper
        sx={{ p: 2, cursor: "pointer" }}
        onClick={() => handleOpen(note, index)}
      >
        <Typography variant="h4">{note.title}</Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
          explicabo alias, ipsa exercitationem rem accusantium voluptatibus
          numquam incidunt hic quaerat facere laborum cupiditate unde tenetur
          aliquid quia, cum ratione magni?
        </Typography>
        <Typography variant="body2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
        </Typography>
      </Paper>
    </Grid>
  );
}

function AddNote({ addNote }) {
  return (
    <Grid size={{ md: 4 }}>
      <Paper sx={{ p: 2, height: "100%" }}>
        <Typography variant="h4">Add Note</Typography>
        <Button onClick={addNote}>Add</Button>
      </Paper>
    </Grid>
  );
}

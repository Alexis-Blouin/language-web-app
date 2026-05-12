import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import toast from "react-simple-toasts";
import axios from "axios";

function AddNote({ setNotes, open, handleClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [example, setExample] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:8081/notes/add", {
        noteTitle: title,
        noteContent: content,
        noteExample: example,
      });
      const noteId = res.data.noteId;
      const added = res.data.added;

      if (added) {
        const newNote = {
          NoteId: noteId,
          NoteTitle: title,
          NoteContent: content,
          NoteExample: example,
        };
        setNotes((prevNotes) => [...prevNotes, newNote]);
        toast("Note added successfully!");
      } else {
        toast("Failed to add note. Please try again.");
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form id="editForm" onSubmit={handleSubmit}>
        <DialogTitle>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            placeholder="My note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </DialogTitle>
        <DialogContent sx={{ p: 4, width: "400px" }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            id="content"
            name="content"
            label="Content"
            placeholder="My note content..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={4}
            id="example"
            name="example"
            label="Example"
            placeholder="My note example..."
            value={example}
            onChange={(event) => setExample(event.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
      </form>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          form="editForm"
          color="primary"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNote;

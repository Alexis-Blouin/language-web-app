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
      const success = res.data.success;
      const message = res.data.message;

      if (success) {
        const newNote = {
          NoteId: noteId,
          NoteTitle: title,
          NoteContent: content,
          NoteExample: example,
        };
        setNotes((prevNotes) => [...prevNotes, newNote]);

        // Reset form fields
        setTitle("");
        setContent("");
        setExample("");

        handleClose();
        toast(message, { theme: "success" });
      } else {
        toast(message, { theme: "failure" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">Add Note</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 4, width: "400px" }}>
        <form id="editForm" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            placeholder="My note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
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
        </form>
      </DialogContent>
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

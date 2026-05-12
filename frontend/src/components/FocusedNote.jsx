import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

function FocusedNote({ note, open, handleClose, onSave }) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    setEditingField(null);
    setEditValue("");
  }, [note]);

  const startEditing = (field, value) => {
    setEditingField(field);
    setEditValue(value ?? "");
  };

  const saveEdit = () => {
    if (!editingField || !note) {
      setEditingField(null);
      return;
    }

    onSave?.({ [editingField]: editValue });
    setEditingField(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      saveEdit();
    } else if (event.key === "Escape") {
      setEditingField(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editingField === "title" ? (
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            placeholder="My note title"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <Typography
            variant="h4"
            onDoubleClick={() => startEditing("title", note?.NoteTitle)}
            sx={{ cursor: "pointer" }}
          >
            {note?.NoteTitle}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent sx={{ p: 4, width: "400px" }}>
        {editingField === "content" ? (
          <TextField
            fullWidth
            multiline
            minRows={4}
            id="content"
            name="content"
            label="Content"
            placeholder="My note content..."
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            sx={{ mt: 2 }}
          />
        ) : (
          <Typography
            variant="body1"
            onDoubleClick={() => startEditing("content", note?.NoteContent)}
            sx={{ mt: 2, cursor: "pointer" }}
          >
            {note?.NoteContent}
          </Typography>
        )}
        {editingField === "example" ? (
          <TextField
            fullWidth
            multiline
            minRows={4}
            id="example"
            name="example"
            label="Example"
            placeholder="My note example..."
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            sx={{ mt: 2 }}
          />
        ) : (
          <Typography
            variant="body1"
            onDoubleClick={() => startEditing("example", note?.NoteExample)}
            sx={{ mt: 2, cursor: "pointer" }}
          >
            {note?.NoteExample}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          form="editForm"
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FocusedNote;

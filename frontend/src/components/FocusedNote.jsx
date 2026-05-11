import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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
      <Box sx={{ p: 4, width: "400px" }}>
        {editingField === "title" ? (
          <TextField
            fullWidth
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <Typography
            variant="h4"
            onDoubleClick={() => startEditing("title", note?.title)}
            sx={{ cursor: "pointer" }}
          >
            {note?.title}
          </Typography>
        )}

        {editingField === "content" ? (
          <TextField
            fullWidth
            multiline
            minRows={4}
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
            onDoubleClick={() => startEditing("content", note?.content)}
            sx={{ mt: 2, cursor: "pointer" }}
          >
            {note?.content}
          </Typography>
        )}
      </Box>
    </Dialog>
  );
}

export default FocusedNote;

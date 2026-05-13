import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import axios from "axios";
import toast from "react-simple-toasts";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteDialog from "./DeleteDialog";

function FocusedNote({ note, setNotes, open, handleClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [example, setExample] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (note) {
      setTitle(note.NoteTitle);
      setContent(note.NoteContent);
      setExample(note.NoteExample);
    }
  }, [note]);

  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.patch("http://localhost:8081/notes/update", {
        noteId: note.NoteId,
        noteTitle: title,
        noteContent: content,
        noteExample: example,
      });
      const updated = res.data.updated;

      if (updated) {
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.NoteId === note.NoteId
              ? {
                  ...n,
                  NoteTitle: title,
                  NoteContent: content,
                  NoteExample: example,
                }
              : n,
          ),
        );
        close();
        toast("Note updated successfully!");
      } else {
        toast("Failed to update note. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const close = () => {
    handleClose();

    if (isEditing) {
      setTitle(note.NoteTitle);
      setContent(note.NoteContent);
      setExample(note.NoteExample);
    }

    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete("http://localhost:8081/notes/delete", {
        params: { noteId: note.NoteId },
      });
      if (res.data.deleted) {
        setNotes((prevNotes) =>
          prevNotes.filter((n) => n.NoteId !== note.NoteId),
        );
        close();
        setDeleteDialogOpen(false);
        toast("Note deleted successfully!");
      } else {
        toast("Failed to delete note. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast("Failed to delete note. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form id="editForm" onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? (
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              placeholder="My note title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          ) : (
            <Typography
              variant="h4"
              onDoubleClick={() => startEditing("title", note?.NoteTitle)}
            >
              {note?.NoteTitle}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 4, width: "400px" }}>
          {isEditing ? (
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
          ) : (
            <Typography
              variant="body1"
              onDoubleClick={() => startEditing("content", note?.NoteContent)}
              sx={{ mt: 2 }}
            >
              {note?.NoteContent}
            </Typography>
          )}
          {isEditing === true ? (
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
          ) : (
            <Typography
              variant="body1"
              onDoubleClick={() => startEditing()}
              sx={{ mt: 2 }}
            >
              {note?.NoteExample}
            </Typography>
          )}
        </DialogContent>
      </form>
      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={stopEditing}>Cancel</Button>
            <Button
              type="submit"
              form="editForm"
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button onClick={startEditing}>
              <EditSquareIcon />
            </Button>
            <Button onClick={handleDeleteClick}>
              <DeleteForeverIcon />
            </Button>
          </>
        )}
      </DialogActions>
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        content={note?.NoteTitle}
        action="Note"
      />
    </Dialog>
  );
}

export default FocusedNote;

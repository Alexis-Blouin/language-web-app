import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function DeleteDialog({
  deleteDialogOpen,
  handleDeleteCancel,
  handleDeleteConfirm,
  word,
}) {
  return (
    <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
      <DialogTitle>Delete Word</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{word ? word.Hanzi : "this word"}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel}>Cancel</Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;

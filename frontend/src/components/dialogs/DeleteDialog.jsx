import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

function DeleteDialog({
  deleteDialogOpen,
  handleDeleteCancel,
  handleDeleteConfirm,
  content,
  action,
}) {
  return (
    <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
      <DialogTitle>Delete {action}</DialogTitle>
      <DialogContent>
        {action === "Query" ? (
          <Typography>Are you sure you want to delete this query?</Typography>
        ) : (
          <Typography>Are you sure you want to delete "{content}"?</Typography>
        )}
        {action === "Chapter" || action === "Category" ? (
          <>
            <Typography variant="body2">
              Words/Expressions associated with {action.toLowerCase()} will be
              assigned to the default category.
            </Typography>
            <Alert severity="warning" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Alert>
          </>
        ) : null}
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

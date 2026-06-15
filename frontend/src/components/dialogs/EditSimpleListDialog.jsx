import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DialogTitle from "@mui/material/DialogTitle";

function EditSimpleListDialog({
  action,
  open,
  handleClose,
  handleChange,
  handleDeleteClick,
  saveChanges,
  items,
  newItems,
  config,
}) {
  const { id, name } = config;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {action}</DialogTitle>
      <DialogContent style={{ paddingTop: "5px" }}>
        <Stack direction="column" spacing={2}>
          {newItems.map((item, index) => (
            <Stack direction="row" spacing={2}>
              <TextField
                required
                id={item[id]}
                name={item[id]}
                placeholder="Name"
                variant="standard"
                value={item[name]}
                onChange={handleChange}
              />
              {items[index][name] !== newItems[index][name] ? (
                <Stack direction="row" spacing={1}>
                  <Typography variant="body1" sx={{ opacity: 0.5 }}>
                    was
                  </Typography>
                  <Typography variant="body1">{items[index][name]}</Typography>
                </Stack>
              ) : (
                <Typography variant="body1" sx={{ opacity: 0.5 }}>
                  No change
                </Typography>
              )}
              <Button onClick={() => handleDeleteClick(item)}>
                <DeleteForeverIcon />
              </Button>
            </Stack>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          form="editForm"
          color="primary"
          variant="contained"
          onClick={() => saveChanges()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditSimpleListDialog;

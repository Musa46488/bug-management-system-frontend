"use client";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ open, onClose, onConfirm }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Delete Bug</DialogTitle>

      <DialogContent sx={{ color: "#555" }}>
        Are you sure you want to delete this bug?
        <br />
        <b>This action cannot be undone.</b>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#555" }}>
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#EC5962",
            "&:hover": { backgroundColor: "#d94c55" },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;

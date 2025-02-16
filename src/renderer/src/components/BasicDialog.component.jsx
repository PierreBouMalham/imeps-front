import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
} from "@mui/material";

export default function BasicDialog({
  open,
  setOpen,
  title,
  children,
  actions,
  ...props
}) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!open}
      onClose={() => setOpen(false)}
      PaperProps={{
        variant: "outlined",
        elevation: 0,
        sx: {
          borderRadius: "24px !important",
        },
      }}
      {...props}
    >
      {title && (
        <DialogTitle sx={{ position: "relative" }}>
          {title}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            size="medium"
            onClick={() => setOpen(false)}
          >
            <Close fontSize="medium" />
          </IconButton>
        </DialogTitle>
      )}
      {children && (
        <DialogContent>
          <Box>{children}</Box>
        </DialogContent>
      )}
      {actions && (
        <DialogActions sx={{ px: 3, pb: 3 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}

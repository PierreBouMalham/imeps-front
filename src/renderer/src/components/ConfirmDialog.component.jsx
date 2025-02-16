import { Box, Button, Typography } from "@mui/material";
import BasicDialog from "./BasicDialog.component";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export default function ConfirmDialog({
  title,
  description,
  onSubmit,
  button,
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {button}
      </div>

      <BasicDialog
        open={!!open}
        setOpen={setOpen}
        maxWidth="xs"
        title={title}
        actions={
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Button
              sx={{ borderRadius: "24px" }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              variant="contained"
              color="inherit"
            >
              Cancel
            </Button>
            <LoadingButton
              sx={{ borderRadius: "24px" }}
              onClick={async (e) => {
                e.stopPropagation();
                setLoading(true);
                await onSubmit?.(open);
                setLoading(false);
                setOpen(false);
              }}
              loading={loading}
              variant="contained"
              color="error"
            >
              Delete
            </LoadingButton>
          </Box>
        }
      >
        <Typography>{description}</Typography>
      </BasicDialog>
    </>
  );
}

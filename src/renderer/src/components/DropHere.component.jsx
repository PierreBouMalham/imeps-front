import { Box, Typography } from "@mui/material";

export default function DropHere({ children }) {
  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "4px dashed",
        borderColor: "divider",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography>{children}</Typography>
    </Box>
  );
}

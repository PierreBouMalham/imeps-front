import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../contexts/Auth.context";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const auth = useAuth();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "calc(100% - 40px)",
          maxWidth: "300px",
        }}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();

          auth.login(data);
        }}
      >
        <Typography>Welcome to</Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{ letterSpacing: "-2px", fontSize: "48px", pb: 5, mt: -2.5 }}
        >
          IMEPS
        </Typography>
        <TextField
          InputProps={{ sx: { borderRadius: "12px" } }}
          type="email"
          label="Email"
          fullWidth
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
          required
        />
        <TextField
          InputProps={{ sx: { borderRadius: "12px" } }}
          type="password"
          label="Password"
          fullWidth
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
          required
        />
        <LoadingButton
          loading={auth.loading}
          type="submit"
          size="large"
          sx={{ borderRadius: "12px" }}
          variant="contained"
          fullWidth
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
}

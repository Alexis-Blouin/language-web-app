import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 2,
        maxWidth: "400px",
      }}
    >
      <form id="login" onSubmit={handleSubmit}>
        <Stack spacing={2} direction={"column"}>
          <Typography variant="h4">Login</Typography>
          <TextField label="Username" required />
          <TextField label="Password" type="password" required />
          <Button
            form="login"
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
          <Box>
            <Typography variant="body2">Don't have an account? </Typography>
            <Link to="/account/create-account">Create an account</Link>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}

export default Login;

import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

function CreateAccount() {
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
      <form id="createAccount" onSubmit={handleSubmit}>
        <Stack spacing={2} direction={"column"}>
          <Typography variant="h4">Create Account</Typography>
          <TextField label="Username" required />
          <TextField label="Password" type="password" required />
          <TextField label="Confirm Password" type="password" required />
          <Button
            form="createAccount"
            variant="contained"
            color="primary"
            type="submit"
          >
            Create Account
          </Button>
          <Box>
            <Typography variant="body2">Already have an account? </Typography>
            <Link to="/account/login">Login</Link>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}

export default CreateAccount;

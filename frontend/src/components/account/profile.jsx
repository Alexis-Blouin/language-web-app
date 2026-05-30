import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Grid from "@mui/material/Grid";

function Profile({ wordsCount, expressionsCount, notesCount }) {
  const { user } = useAuth();

  return (
    <Box sx={{ width: "50%", margin: "16px auto", justifyContent: "center" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Word of The Day</Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">{user?.accountUsername}</Typography>
            <Typography variant="h5">{user?.accountEmail}</Typography>
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Stats</Typography>
            <Typography variant="h5">{wordsCount} Words</Typography>
            <Typography variant="h5">{expressionsCount} Expressions</Typography>
            <Typography variant="h5">{notesCount} Notes</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;

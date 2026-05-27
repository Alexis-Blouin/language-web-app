import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";

function Queries() {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/ai/get")
      .then((res) => setQueries(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box sx={{ margin: "16px auto", width: "75%" }}>
      <Grid container spacing={2}>
        {queries.map((query, index) => (
          <Item query={query} index={index} />
        ))}
      </Grid>
    </Box>
  );
}

export default Queries;

function Item({ query, index, handleOpen }) {
  return (
    <Grid size={{ md: 4 }}>
      <Paper
        sx={{ p: 2, cursor: "pointer" }}
        onClick={() => handleOpen(query, index)}
      >
        <Stack spacing={1} direction="column">
          <Typography variant="h4">{query.originalText}</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {query.question.length > 100
              ? query.question.substring(0, 100) + "..."
              : query.question}
          </Typography>
          <Divider textAlign="left">Example</Divider>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {query.correctedText.length > 100
              ? query.correctedText.substring(0, 100) + "..."
              : query.correctedText}
          </Typography>
        </Stack>
      </Paper>
    </Grid>
  );
}

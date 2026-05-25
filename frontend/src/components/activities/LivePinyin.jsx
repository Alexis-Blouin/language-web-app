import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { pinyin } from "pinyin-pro";
import React, { useState } from "react";
import Box from "@mui/material/Box";

function LivePinyin() {
  const [input, setInput] = useState("");

  // Need a custom function because of the multiline input
  function getPinyin() {
    return input
      .split("\n")
      .map((line) => pinyin(line))
      .join("\n");
  }

  return (
    <Paper sx={{ width: "400px", mt: 2, mr: "auto", ml: "auto", p: 2 }}>
      <Stack direction="column" spacing={2} alignItems="center">
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Live Pinyin Converter
        </Typography>
        <TextField
          multiline
          id="hanzi-input"
          label="Hanzi"
          placeholder="请输入汉字"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Box>
          <Typography variant="h5">Pinyin Output:</Typography>
          {input && (
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {getPinyin()}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

export default LivePinyin;

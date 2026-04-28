import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { pinyin } from "pinyin-pro";
import React from "react";

function WordAttach({ words }) {
  const [listLeft, setListLeft] = React.useState([]);
  const [listRight, setListRight] = React.useState([]);
  const [wordCount, setWordCount] = React.useState(5);

  const generateRandomWords = React.useCallback(() => {
    if (!words || words.length === 0) return;

    // Clear existing lists and generate new random words
    const newLeft = [];
    const newRight = [];

    for (let i = 0; i < wordCount; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      newLeft.push({ translation: randomWord.Translation });
      newRight.push({ hanzi: randomWord.Hanzi, pinyin: randomWord.Pinyin });
    }

    setListLeft(shuffleList(newLeft));
    setListRight(shuffleList(newRight));
  }, [words, wordCount]);

  const shuffleList = (list) => {
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  React.useEffect(() => {
    generateRandomWords();
  }, [generateRandomWords]);

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: "500px",
        mt: 2,
        mr: "auto",
        ml: "auto",
        justifyContent: "center",
      }}
    >
      <Button variant="contained" onClick={generateRandomWords}>
        Generate Random Words
      </Button>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        {/* Left column - Translations */}
        <Box>
          <Stack direction="column" spacing={1}>
            {listLeft.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  minWidth: 120,
                }}
              >
                <Typography>{item.translation}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Right column - Hanzi & Pinyin */}
        <Box>
          <Stack direction="column" spacing={1}>
            {listRight.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  minWidth: 120,
                }}
              >
                <Typography variant="h5">{item.hanzi}</Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {item.pinyin}
                </Typography> */}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

export default WordAttach;

function List() {
  return <Stack direction="column" spacing={2}></Stack>;
}

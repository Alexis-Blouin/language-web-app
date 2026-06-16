import toast from "react-simple-toasts";
import { useState, useEffect, useMemo } from "react";
import { pinyin } from "pinyin-pro";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SkipNextIcon from "@mui/icons-material/SkipNext";

function WordGuess({ words }) {
  const [word, setWord] = useState();
  const [guessHanzi, setGuessHanzi] = useState(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [guess, setGuess] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [answerGiven, setAnswerGiven] = useState(false);

  const title = guessHanzi ? "Hanzi" : "Translation";

  // Set the word once words is actually loaded
  useEffect(() => {
    if (words) changeWord();
  }, [words]);

  const changeWord = () => {
    setHintCount(0);
    setShowPinyin(false);
    setAnswerGiven(false);
    setGuessHanzi(Math.random() < 0.75);
    setWord(words[Math.floor(Math.random() * words.length)]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      (guessHanzi &&
        word.translation.toLowerCase().includes(guess.toLowerCase())) ||
      (!guessHanzi && word.hanzi.includes(guess))
    ) {
      setButtonsDisabled(true);
      setTimeout(() => {
        setGuess("");
        setButtonsDisabled(false);
        changeWord();
      }, 2000);
      toast("Correct!", { theme: "success" });
    } else {
      toast("Incorrect...", { theme: "failure" });
    }
  };

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const onHintClick = () => {
    switch (hintCount) {
      case 0:
        toast("Chapter: " + word.chapterName, { theme: "info" });
        break;
      case 1:
        toast("Category: " + word.categoryName, { theme: "info" });
        break;
      case 2:
        toast("Pinyin: " + word.pinyin, { theme: "info" });
        setShowPinyin(true);
        break;
    }
    setHintCount(hintCount + 1);
  };

  const giveUp = () => {
    setGuess(guessHanzi ? word.translation : word.hanzi);
    toast("Better luck next time", { theme: "info" });
    setAnswerGiven(true);
  };

  return (
    <Paper sx={{ width: "400px", mt: 2, mr: "auto", ml: "auto", p: 2 }}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Guess The {title}
        </Typography>
        <Typography variant="h5">
          {guessHanzi ? word?.hanzi : word?.translation}
          {showPinyin && (
            <Typography variant="caption"> ({word?.pinyin})</Typography>
          )}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={2} alignItems="center">
            <TextField
              required
              name="guess"
              id="guess"
              label="Answer"
              placeholder={guessHanzi ? "Hi" : "你好"}
              value={guess}
              onChange={handleGuessChange}
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={buttonsDisabled}
            >
              Submit
            </Button>
          </Stack>
        </form>

        <Stack direction="row" sx={{ mt: 2, justifyContent: "space-between" }}>
          <Button
            variant="contained"
            onClick={onHintClick}
            disabled={showPinyin || buttonsDisabled}
          >
            <QuestionMarkIcon />
          </Button>
          <Button
            variant="contained"
            onClick={giveUp}
            disabled={answerGiven || buttonsDisabled}
          >
            <SkipNextIcon />
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default WordGuess;

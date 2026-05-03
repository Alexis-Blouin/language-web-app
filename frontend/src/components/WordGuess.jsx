import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/style.css"; // Will give a warning, but works anyway.
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { useState } from "react";
import { pinyin } from "pinyin-pro";
import React from "react";

import reload from "../assets/images/reload.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// specify the theme in toastConfig
toastConfig({
  theme: "dark",
});

function WordGuess({ words }) {
  // Set the word once words is actually loaded
  React.useEffect(() => {
    if (words) setWord(pickRandomWord());
  }, [words]);

  const concatWords = React.useMemo(() => {
    const result = {};

    words.forEach((word) => {
      const hanzi = word.Hanzi;
      const translation = word.Translation.toLowerCase();

      if (result[hanzi]) {
        result[hanzi].push(translation);
      } else {
        result[hanzi] = [translation];
      }
    });

    return result;
  }, [words]);

  const pickRandomWord = () => {
    const keys = Object.keys(concatWords);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomTranslations = concatWords[randomKey];
    // const hideHanzi = Math.random() < 0.5;
    const hideHanzi = false; // TODO fix switch between hanzi and translation

    return {
      question: hideHanzi ? randomTranslations : randomKey,
      answer: hideHanzi ? randomKey : randomTranslations,
      hanzi: hideHanzi,
    };
  };
  const [word, setWord] = useState(pickRandomWord);
  const title = word.hideHanzi ? "Hanzi" : "Translation";
  console.log(word);

  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const changeWord = () => {
    setWord(pickRandomWord());
  };

  return (
    <Stack
      direction="column"
      sx={{ width: "400px", mt: 2, mr: "auto", ml: "auto" }}
      spacing={2}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Guess the {title}
      </Typography>
      <Typography variant="h5">
        {word.question}
        {!word.hideHanzi && (
          // TODO use the pinyin from the DB instead since the function does not always return the same
          <Typography variant="caption"> ({pinyin(word.question)})</Typography>
        )}
      </Typography>

      {/* <button
            id="changeGuessButton"
            onClick={changeWord}
            disabled={buttonDisabled}
          >
            <img src={reload} alt="Reload" />
          </button> */}
      <Guess
        answer={word.answer}
        hideHanzi={!word.hideHanzi}
        changeWord={changeWord}
        buttonDisabled={isButtonDisabled}
        setButtonDisabled={setButtonDisabled}
      />
    </Stack>
  );
}

export default WordGuess;

function Guess({
  answer,
  hideHanzi,
  changeWord,
  buttonDisabled,
  setButtonDisabled,
}) {
  const [guess, setGuess] = React.useState("");
  const [pinyinHint, setPinyinHint] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (answer.includes(guess.toLowerCase())) {
      setButtonDisabled(true);
      setTimeout(() => {
        setGuess("");
        setPinyinHint("");
        setButtonDisabled(false);
        changeWord();
      }, 2000);
      toast("Correct!", { theme: "success" });
    } else {
      toast("Incorrect...", { theme: "failure" });
    }
  };

  const handleChange = (event) => {
    const val = event.target.value;
    setGuess(val);
    if (true) {
      setPinyinHint(pinyin(val));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={2} alignItems="center">
        <TextField
          required
          name="guess"
          id="guess"
          label="Answer"
          placeholder={hideHanzi ? "Hi" : "你好"}
          value={guess}
          onChange={handleChange}
          autoComplete="off"
        />
        <Button type="submit" variant="contained" disabled={buttonDisabled}>
          Submit
        </Button>
        {/* {!hideHanzi && pinyinHint !== "" && (
        <span id="hanzi-hint"> ({pinyinHint})</span>
      )} */}
      </Stack>
    </form>
  );
}

import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/style.css"; // Will give a warning, but works anyway.
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { useState } from "react";
import { pinyin } from "pinyin-pro";
import React from "react";

import reload from "../assets/images/reload.png";

// specify the theme in toastConfig
toastConfig({
  theme: "dark",
});

function WordGuess({ words }) {
  const pickRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const hideHanzi = Math.random() < 0.5;

    return {
      question: hideHanzi ? randomWord.translation : randomWord.hanzi,
      answer: hideHanzi ? randomWord.hanzi : randomWord.translation,
      hideHanzi,
    };
  };
  const [word, setWord] = useState(pickRandomWord);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const changeWord = () => {
    setWord(pickRandomWord());
  };

  return (
    <div id="wordGuess">
      <Question
        question={word.question}
        hideHanzi={word.hideHanzi}
        changeWord={changeWord}
        buttonDisabled={isButtonDisabled}
      />
      <Guess
        answer={word.answer}
        hideHanzi={!word.hideHanzi}
        changeWord={changeWord}
        buttonDisabled={isButtonDisabled}
        setButtonDisabled={setButtonDisabled}
      />
    </div>
  );
}

export default WordGuess;

function Question({ question, hideHanzi, changeWord, buttonDisabled }) {
  const title = hideHanzi ? "Translation" : "Hanzi";
  // <a href="https://www.flaticon.com/free-icons/reload" title="reload icons">Reload icons created by shin_icons - Flaticon</a>
  return (
    <div id="questionBox" className="guessContent">
      <p className="guessTitle fullWidth">{title}:</p>
      <div>
        <p id="questionText" className="fullWidth">
          {question}
          {!hideHanzi && <span id="hazi-hint"> ({pinyin(question)})</span>}
          <button
            id="changeGuessButton"
            onClick={changeWord}
            disabled={buttonDisabled}
          >
            <img src={reload} alt="Reload" />
          </button>
        </p>
      </div>
    </div>
  );
}

function Guess({
  answer,
  hideHanzi,
  changeWord,
  buttonDisabled,
  setButtonDisabled,
}) {
  const title = hideHanzi ? "Translation" : "Hanzi";
  const [guess, setGuess] = React.useState("");
  const [pinyinHint, setPinyinHint] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (guess === answer) {
      setButtonDisabled(true);
      setTimeout(() => {
        event.target.guess.value = "";
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
    <div id="guessBox" className="guessContent">
      <p className="guessTitle fullWidth">{title}:</p>
      <form id="guessForm" onSubmit={handleSubmit}>
        <label htmlFor="guess">
          <input
            className="fullWidth"
            type="text"
            name="guess"
            id="guess"
            placeholder="answer"
            value={guess}
            onChange={handleChange}
          />
        </label>
        {!hideHanzi && pinyinHint !== "" && (
          <span id="hanzi-hint"> ({pinyinHint})</span>
        )}
        <button id="guessButton" disabled={buttonDisabled}>
          Confirm
        </button>
      </form>
    </div>
  );
}

import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/style.css"; // Will give a warning, but works anyway.
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { useState } from "react";

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
      <p className="fullWidth">{title}:</p>
      <div>
        <p id="questionText" className="fullWidth">
          {question}
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const guess = event.target.guess.value;
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

  return (
    <div id="guessBox" className="guessContent">
      <p className="fullWidth">{title}:</p>
      <form id="guessForm" onSubmit={handleSubmit}>
        <label htmlFor="guess">
          <input
            className="fullWidth"
            type="text"
            name="guess"
            id="guess"
            placeholder="answer"
          />
        </label>
        <button id="guessButton" disabled={buttonDisabled}>
          Confirm
        </button>
      </form>
    </div>
  );
}

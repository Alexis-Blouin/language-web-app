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

  const changeWord = () => {
    setWord(pickRandomWord());
  };

  return (
    <div id="wordGuess">
      <Question
        question={word.question}
        hideHanzi={word.hideHanzi}
        changeWord={changeWord}
      />
      <Guess
        answer={word.answer}
        hideHanzi={!word.hideHanzi}
        changeWord={changeWord}
      />
    </div>
  );
}

export default WordGuess;

function Question({ question, hideHanzi, changeWord }) {
  const title = hideHanzi ? "Translation" : "Hanzi";
  // <a href="https://www.flaticon.com/free-icons/reload" title="reload icons">Reload icons created by shin_icons - Flaticon</a>
  return (
    <div id="questionBox" className="guessContent">
      <p className="fullWidth">{title}:</p>
      <div>
        <p id="questionText" className="fullWidth">
          {question}
          <button id="changeGuessButton" onClick={changeWord}>
            <img src={reload} alt="Reload" />
          </button>
        </p>
      </div>
    </div>
  );
}

function Guess({ answer, hideHanzi, changeWord }) {
  const title = hideHanzi ? "Translation" : "Hanzi";

  const handleSubmit = (event) => {
    event.preventDefault();
    const guess = event.target.guess.value;
    if (guess === answer) {
      event.target.guess.value = "";
      changeWord();
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
        <button id="guessButton">Confirm</button>
      </form>
    </div>
  );
}

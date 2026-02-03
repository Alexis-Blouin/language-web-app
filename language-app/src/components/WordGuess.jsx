import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/style.css"; // Will give a warning, but works anyway.
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";

// specify the theme in toastConfig
toastConfig({
  theme: "dark",
});

function WordGuess({ words }) {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const hideHanzi = Math.random() < 0.5;
  const [question, answer] = hideHanzi
    ? [randomWord.translation, randomWord.hanzi]
    : [randomWord.hanzi, randomWord.translation];

  return (
    <div id="wordGuess">
      <Question question={question} hideHanzi={hideHanzi} />
      <Guess answer={answer} hideHanzi={!hideHanzi} />
    </div>
  );
}

export default WordGuess;

function Question({ question, hideHanzi }) {
  const title = hideHanzi ? "Translation" : "Hanzi";
  return (
    <div id="questionBox" className="guessContent">
      <p>{title}:</p>
      <p id="questionText">{question}</p>
    </div>
  );
}

function Guess({ answer, hideHanzi }) {
  const title = hideHanzi ? "Translation" : "Hanzi";

  const handleSubmit = (event) => {
    event.preventDefault();
    const guess = event.target.guess.value;
    if (guess === answer) {
      toast("Correct!", { theme: "success" });
    } else {
      toast("Incorrect...", { theme: "failure" });
    }
  };

  return (
    <div id="guessBox" className="guessContent">
      <p>{title}:</p>
      <form id="guessForm" onSubmit={handleSubmit}>
        <label htmlFor="guess">
          <input type="text" name="guess" id="guess" placeholder="answer" />
        </label>
        <button id="guessButton">Confirm</button>
      </form>
    </div>
  );
}

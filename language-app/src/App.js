import "./App.css";
import WordList from "./components/WordList";
import AddForm from "./components/AddForm";
import React from "react";
import WordGuess from "./components/WordGuess";

function App() {
  const [words, setWords] = React.useState([{ hanzi: "你好", trslt: "hi" }]);
  return (
    <div>
      <AddForm words={words} setWords={setWords} />
      <WordList words={words} />
      <WordGuess words={words} />
    </div>
  );
}

export default App;

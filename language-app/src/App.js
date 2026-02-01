import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/WordListHome";
import WordListHidden from "./components/WordListHidden";
import AddForm from "./components/AddForm";
import React from "react";
import WordGuess from "./components/WordGuess";

function App() {
  const [words, setWords] = React.useState([{ hanzi: "你好", trslt: "hi" }]);

  // Retrieve saved word list.
  React.useEffect(() => {
    const storedWords = localStorage.getItem("words");
    if (storedWords) {
      setWords(JSON.parse(storedWords));
    }
  }, []);

  return (
    <Router>
      <nav className="header">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/add_words">Add Words</Link>
          </li>
          <li>
            <Link to="/list_hidden">List Hidden</Link>
          </li>
          <li>
            <Link to="/word_guess">Word Guess</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<WordListHome words={words} />} />
        <Route
          path="/add_words"
          element={<AddForm words={words} setWords={setWords} />}
        />
        <Route path="/list_hidden" element={<WordListHidden words={words} />} />
        <Route path="/word_guess" element={<WordGuess words={words} />} />
      </Routes>
    </Router>
  );
}

export default App;

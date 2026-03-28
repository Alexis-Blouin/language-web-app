import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/WordListHome";
import WordListHidden from "./components/WordListHidden";
import AddForm from "./components/AddForm";
import React, { useState, useEffect } from "react";
import WordGuess from "./components/WordGuess";
import axios from "axios";

function App() {
  const [words, setWords] = useState([]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/words/get")
      .then((res) => setWords(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/chapters/get")
      .then((res) => setChapters(res.data))
      .catch((err) => console.log(err));
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
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              <WordListHome
                words={words}
                setWords={setWords}
                chapters={chapters}
              />
            }
          />
          <Route
            path="/add_words"
            element={
              <AddForm words={words} setWords={setWords} chapters={chapters} />
            }
          />
          <Route
            path="/list_hidden"
            element={<WordListHidden words={words} chapters={chapters} />}
          />
          <Route path="/word_guess" element={<WordGuess words={words} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

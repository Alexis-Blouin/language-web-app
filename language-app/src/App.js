import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/WordListHome";
import WordListHidden from "./components/WordListHidden";
import AddForm from "./components/AddForm";
import React from "react";
import WordGuess from "./components/WordGuess";

function App() {
  const [words, setWords] = React.useState([
    { hanzi: "你好", pinyin: "nǐhǎo", translation: "hi" },
  ]);

  const chapters = React.useMemo(() => {
    return [
      ...new Set(
        words
          .map((word) => word.chapter)
          .filter(Boolean)
          .sort(),
      ),
    ];
  }, [words]);
  console.log(chapters);

  // Retrieve saved word list.
  React.useEffect(() => {
    const storedWords = localStorage.getItem("words");
    if (storedWords) {
      const tmpWords = JSON.parse(storedWords);

      setWords(
        tmpWords.map((word) =>
          typeof word.chapter === "undefined"
            ? { ...word, chapter: "" }
            : { ...word, chapter: word.chapter.toString().trim() },
        ),
      );
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

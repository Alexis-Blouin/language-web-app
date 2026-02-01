import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordList from "./components/WordList";
import AddForm from "./components/AddForm";
import React from "react";
import WordGuess from "./components/WordGuess";
import Test from "./components/Test";

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
    <div>
      <AddForm words={words} setWords={setWords} />
      <WordList words={words} />
      <WordGuess words={words} />
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/test">test</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

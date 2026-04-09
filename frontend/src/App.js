import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/WordListHome";
import WordListHidden from "./components/WordListHidden";
import AddForm from "./components/AddForm";
import React, { useState, useEffect } from "react";
import WordGuess from "./components/WordGuess";
import Expressions from "./components/Expressions";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// A soft, easy-on-the-eyes theme with a light neutral background and refined colors
const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    primary: {
      main: "#2c3e50",
      light: "#34495e",
      dark: "#1a252f",
    },
    secondary: {
      main: "#3498db",
      light: "#5dade2",
      dark: "#2980b9",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [words, setWords] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [types, setTypes] = useState([]);

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

  useEffect(() => {
    axios
      .get("http://localhost:8081/words/get", {
        params: { WordTypeId: 2 },
      })
      .then((res) => setExpressions(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/types/get")
      .then((res) => setTypes(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            <li>
              <Link to="/expressions">Expressions</Link>
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
                <AddForm
                  setWords={setWords}
                  setExpressions={setExpressions}
                  chapters={chapters}
                  setChapters={setChapters}
                  types={types}
                />
              }
            />
            <Route
              path="/list_hidden"
              element={<WordListHidden words={words} chapters={chapters} />}
            />
            <Route path="/word_guess" element={<WordGuess words={words} />} />
            <Route
              path="/expressions"
              element={
                <Expressions
                  expressions={expressions}
                  setExpressions={setExpressions}
                  chapters={chapters}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

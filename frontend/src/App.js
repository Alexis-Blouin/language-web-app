// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:8081/persons")
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   const addUser = () => {
//     axios
//       .post("http://localhost:8081/persons", { name, email })
//       .then((res) => {
//         alert(res.data.message);
//         setUsers([...users, { name, email }]);
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div>
//       <h1>React + MySQL Example</h1>
//       <input
//         type="text"
//         placeholder="Name"
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button onClick={addUser}>Add User</button>

//       <ul>
//         {users.map((user, i) => (
//           <li key={i}>
//             {user.FirstName} - {user.LastName}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/WordListHome";
import WordListHidden from "./components/WordListHidden";
import AddForm from "./components/AddForm";
import React, { useState, useEffect } from "react";
import WordGuess from "./components/WordGuess";
import axios from "axios";

function App() {
  // const [words, setWords] = React.useState([
  //   { hanzi: "你好", pinyin: "nǐhǎo", translation: "hi" },
  // ]);
  const [words, setWords] = useState([]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/words/get")
      .then((res) => setWords(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(words);

  // const chapters = React.useMemo(() => {
  //   return [
  //     ...new Set(
  //       words
  //         .map((word) => word.chapter)
  //         .filter(Boolean)
  //         .sort(),
  //     ),
  //   ];
  // }, [words]);
  useEffect(() => {
    axios
      .get("http://localhost:8081/chapters/get")
      .then((res) =>
        setChapters(
          res.data.map(function (chapter) {
            return chapter.ChapterName;
          }),
        ),
      )
      .catch((err) => console.log(err));
  }, []);
  // setChapters(
  //   chapters.map(function (chapter) {
  //     return chapter.ChapterName;
  //   }),
  // );
  console.log(chapters);

  // Retrieve saved word list.
  // React.useEffect(() => {
  //   const storedWords = localStorage.getItem("words");
  //   if (storedWords) {
  //     const tmpWords = JSON.parse(storedWords);

  //     setWords(
  //       tmpWords.map((word) =>
  //         typeof word.chapter === "undefined"
  //           ? { ...word, chapter: "" }
  //           : { ...word, chapter: word.chapter.toString().trim() },
  //       ),
  //     );
  //   }
  // }, []);

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

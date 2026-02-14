import React from "react";
import Filters from "./Filters";

function WordListHidden({ words, chapters }) {
  const [chapter, setChapter] = React.useState("all");

  return (
    <>
      <Filters chapters={chapters} chapter={chapter} setChapter={setChapter} />{" "}
      <table className="wordList">
        <thead>
          <tr>
            <th>Hanzi</th>
            <th>Pinyin</th>
            <th>Translation</th>
          </tr>
        </thead>
        <tbody>
          {words && words.length > 0 ? (
            words
              .filter(
                (word) =>
                  chapter === "all" ||
                  (chapter === "no-chapter" && "" === word.chapter) ||
                  chapter === word.chapter,
              )
              .map((word, index) => <Item word={word} />)
          ) : (
            <tr>
              <td colSpan={3}>No words yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default WordListHidden;

function Item({ word }) {
  const unhideWord = (target) => {
    target.target.classList.remove("hidden-word");
  };

  return (
    <tr>
      <td>{word.hanzi}</td>
      <td>{word.pinyin}</td>
      <td className="hidden-word" onClick={unhideWord}>
        {word.translation}
      </td>
    </tr>
  );
}

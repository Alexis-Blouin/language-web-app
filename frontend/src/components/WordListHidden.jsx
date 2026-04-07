import React from "react";
import ChapterSelect from "./ChapterSelect";

import reload from "../assets/images/reload.png";

function WordListHidden({ words, chapters }) {
  const [chapter, setChapter] = React.useState("all");
  const [hiddenColumns, setHiddenColumns] = React.useState({
    hanzi: false,
    pinyin: false,
    translation: true,
  });

  const handleHiddenColumnChange = (e) => {
    setHiddenColumns((values) => ({
      ...values,
      [e.target.name]: e.target.checked,
    }));
  };

  // TODO
  const resetHidden = () => {};

  return (
    <>
      <ChapterSelect
        chapters={chapters}
        defaultChapter={chapter}
        setChapter={setChapter}
      />{" "}
      <label>
        Hanzi:
        <input
          type="checkbox"
          name="hanzi"
          checked={hiddenColumns.hanzi}
          onChange={handleHiddenColumnChange}
        />
      </label>
      <label>
        Pinyin:
        <input
          type="checkbox"
          name="pinyin"
          checked={hiddenColumns.pinyin}
          onChange={handleHiddenColumnChange}
        />
      </label>
      <label>
        Translation:
        <input
          type="checkbox"
          name="translation"
          checked={hiddenColumns.translation}
          onChange={handleHiddenColumnChange}
        />
      </label>
      <button id="resetHidden" onClick={resetHidden}>
        <img src={reload} alt="Reload" />
      </button>
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
                  (chapter === "no-chapter" && "" === word.Chapter) ||
                  parseInt(chapter) === word.ChapterId,
              )
              .map((word, index) => (
                <Item word={word} hiddenColumns={hiddenColumns} />
              ))
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

function Item({ word, hiddenColumns }) {
  const unhideWord = (target) => {
    target.target.classList.remove("hidden-word");
  };

  return (
    <tr>
      <td
        className={hiddenColumns.hanzi ? "hidden-word" : ""}
        onClick={unhideWord}
      >
        {word.Hanzi}
      </td>
      <td
        className={hiddenColumns.pinyin ? "hidden-word" : ""}
        onClick={unhideWord}
      >
        {word.Pinyin}
      </td>
      <td
        className={hiddenColumns.translation ? "hidden-word" : ""}
        onClick={unhideWord}
      >
        {word.Translation}
      </td>
    </tr>
  );
}

import React from "react";
import { pinyin } from "pinyin-pro";
import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";
import cancel_icon from "../assets/images/cancel.png";
import confirmation_icon from "../assets/images/confirmation.png";
import ChapterSelect from "./ChapterSelect";

function WordList({ words, setWords, chapters }) {
  const [chapter, setChapter] = React.useState("all");

  return (
    <>
      <ChapterSelect
        chapters={chapters}
        defaultChapter={chapter}
        setChapter={setChapter}
      />
      <table className="wordList">
        <thead>
          <tr>
            <th>Hanzi</th>
            <th>Pinyin</th>
            <th>Translation</th>
            <th>Chapter</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {words && words.length > 0 ? (
            words
              .filter(
                (word) =>
                  chapter === "all" ||
                  (chapter === "no-chapter" && "" === word.Chapter) ||
                  chapter === word.Chapter,
              )
              .map((word, index) => (
                <Item
                  word={word}
                  words={words}
                  setWords={setWords}
                  chapters={chapters}
                />
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

export default WordList;

function Item({ word, words, setWords, chapters }) {
  const [editing, setEditing] = React.useState(false);
  const [editChapter, setEditChapter] = React.useState(word.chapter);

  const deleteEntry = () => {
    setWords((prevWords) => prevWords.filter((aWord) => aWord.id !== word.id));
    const updatedWords = JSON.stringify(
      words.filter((aWord) => aWord.id !== word.id),
    );
    localStorage.setItem("words", updatedWords);
  };

  // TODO make edit word function
  const editEntry = (event) => {
    event.preventDefault();
    setEditing(true);
  };

  const editSubmit = (event) => {
    event.preventDefault();

    const hanzi = event.target.hanzi.value;
    // If the pinyin value was edited, we take this one, else, we get the pinyin with pinyin-pro
    const pinyinVal =
      (event.target.pinyin.value === word.pinyin && hanzi !== word.hanzi) ||
      event.target.pinyin.value === ""
        ? pinyin(hanzi)
        : event.target.pinyin.value;
    const translation = event.target.translation.value;

    setWords((prevWords) =>
      prevWords.map((aWord) =>
        aWord.id === word.id
          ? {
              ...aWord,
              hanzi: hanzi,
              pinyin: pinyinVal,
              translation: translation,
              chapter: editChapter === "no-chapter" ? "" : editChapter,
            }
          : aWord,
      ),
    );

    const updatedWords = words.map((aWord) =>
      aWord.id === word.id
        ? {
            ...aWord,
            hanzi: hanzi,
            pinyin: pinyinVal,
            translation: translation,
            chapter: editChapter === "no-chapter" ? "" : editChapter,
          }
        : aWord,
    );
    localStorage.setItem("words", JSON.stringify(updatedWords));

    setEditing(false);
  };

  const editCancel = (event) => {
    event.preventDefault();
    setEditing(false);
  };

  //<a href="https://www.flaticon.com/free-icons/edit" title="edit icons">Edit icons created by Pixel perfect - Flaticon</a>
  //<a href="https://www.flaticon.com/free-icons/delete" title="delete icons">Delete icons created by Ilham Fitrotul Hayat - Flaticon</a>
  //<a href="https://www.flaticon.com/free-icons/cancel" title="cancel icons">Cancel icons created by Fingerprint Designs - Flaticon</a>
  //<a href="https://www.flaticon.com/free-icons/confirm" title="confirm icons">Confirm icons created by bqlqn - Flaticon</a>
  console.log(word.Hanzi);
  return (
    <tr>
      {editing ? (
        <>
          <td>
            <input
              form={word.id}
              type="text"
              name="hanzi"
              id="hanzi"
              defaultValue={word.Hanzi}
            />
          </td>
          <td>
            <input
              form={word.id}
              type="text"
              name="pinyin"
              id="pinyin"
              defaultValue={word.Pinyin}
            />
          </td>
          <td>
            <input
              form={word.id}
              type="text"
              name="translation"
              id="translation"
              defaultValue={word.Meaning}
            />
          </td>
          <td>
            <ChapterSelect
              chapters={chapters}
              defaultChapter={editChapter}
              setChapter={setEditChapter}
              allChapters={false}
            />
          </td>
          <td className="options">
            <form id={word.id} onSubmit={editSubmit}>
              <button className="icon-button" type="submit">
                <img src={confirmation_icon} alt="Confirm" />
              </button>
              <button className="icon-button" onClick={editCancel}>
                <img src={cancel_icon} alt="Cancel" />
              </button>
            </form>
          </td>
        </>
      ) : (
        <>
          <td>{word.Hanzi}</td>
          <td>{word.Pinyin}</td>
          <td>{word.Meaning}</td>
          <td>{word.ChapterName}</td>
          <td className="options">
            <button className="icon-button" onClick={editEntry}>
              <img src={edit_icon} alt="Edit" />
            </button>
            <button className="icon-button" onClick={deleteEntry}>
              <img src={delete_icon} alt="Delete" />
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

import React from "react";
import { pinyin } from "pinyin-pro";
import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";
import cancel_icon from "../assets/images/cancel.png";
import confirmation_icon from "../assets/images/confirmation.png";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";

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
  const [editChapter, setEditChapter] = React.useState(word.ChapterName);

  const deleteEntry = async () => {
    // TODO receive success or fail to update or not the data and show a toast
    await axios.delete("http://localhost:8081/words/delete", {
      // params here since it's delete and not post
      params: { WordID: word.WordID, TranslationID: word.TranslationID },
    });
    // Updates the visible data
    setWords((prevWords) =>
      prevWords.filter(
        (aWord) =>
          aWord.WordID !== word.WordID &&
          aWord.TranslationID !== word.TranslationID,
      ),
    );
  };

  // TODO make edit word function
  const editEntry = (event) => {
    event.preventDefault();
    setEditing(true);
  };

  const editSubmit = async (event) => {
    event.preventDefault();

    const hanzi = event.target.hanzi.value;
    // If the pinyin value was edited, we take this one, else, we get the pinyin with pinyin-pro
    const pinyinVal =
      (event.target.pinyin.value === word.pinyin && hanzi !== word.hanzi) ||
      event.target.pinyin.value === ""
        ? pinyin(hanzi)
        : event.target.pinyin.value;
    const translation = event.target.translation.value;
    console.log(chapters);
    const chapterName = chapters.filter(
      (chapter) => chapter.ChapterID === parseInt(editChapter),
    )[0].ChapterName;
    console.log(chapterName);

    const res = await axios.patch("http://localhost:8081/words/modify", {
      wordId: word.WordID,
      translationId: word.TranslationID,
      newHanzi: hanzi,
      newPinyin: pinyinVal,
      newChapterId: editChapter,
      newMeaning: translation,
      wordTranslationId: word.WordTranslationID,
    });

    setWords((prevWords) =>
      prevWords.map((aWord) =>
        aWord.WordID === word.WordID
          ? {
              ...aWord,
              WordID: res.data.wordId,
              Hanzi: hanzi,
              Pinyin: pinyinVal,
              TranslationID: res.data.translationId,
              Translation: translation,
              ChapterID: editChapter,
              ChapterName: chapterName,
            }
          : aWord,
      ),
    );

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
  return (
    <tr>
      {editing ? (
        <>
          <td>
            <input
              form={word.WordID + "-" + word.TranslationID}
              type="text"
              name="hanzi"
              id="hanzi"
              defaultValue={word.Hanzi}
            />
          </td>
          <td>
            <input
              form={word.WordID + "-" + word.TranslationID}
              type="text"
              name="pinyin"
              id="pinyin"
              defaultValue={word.Pinyin}
            />
          </td>
          <td>
            <input
              form={word.WordID + "-" + word.TranslationID}
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
            <form
              id={word.WordID + "-" + word.TranslationID}
              onSubmit={editSubmit}
            >
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

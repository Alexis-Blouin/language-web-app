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
                  parseInt(chapter) === word.ChapterId,
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
      params: { WordId: word.WordId, TranslationId: word.TranslationId },
    });
    // Updates the visible data
    setWords((prevWords) =>
      prevWords.filter(
        (aWord) =>
          !(
            aWord.WordId === word.WordId &&
            aWord.TranslationId === word.TranslationId
          ),
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
    const pinyinInput = event.target.pinyin.value;
    // If the pinyin value was edited, we take this one, else, we get the pinyin with pinyin-pro
    const pinyinVal =
      (pinyinInput === word.Pinyin && hanzi !== word.Hanzi) ||
      pinyinInput === ""
        ? pinyin(hanzi)
        : pinyinInput;
    const translation = event.target.translation.value;
    const chapterId = parseInt(editChapter);
    const chapterName = chapters.filter(
      (chapter) => chapter.ChapterId === chapterId,
    )[0].ChapterName;

    const res = await axios.patch("http://localhost:8081/words/modify", {
      wordId: word.WordId,
      translationId: word.TranslationId,
      newHanzi: hanzi,
      newPinyin: pinyinVal,
      newChapterId: chapterId,
      newTranslation: translation,
      wordTranslationId: word.WordTranslationId,
      typeId: word.TypeId,
    });

    // TODO update word Id and translation Id since if re-creating a word it won't allow to delete after
    setWords((prevWords) =>
      prevWords.map((aWord) =>
        aWord.WordId === word.WordId
          ? {
              ...aWord,
              WordId: res.data.wordId,
              Hanzi: hanzi,
              Pinyin: pinyinVal,
              TranslationId: res.data.translationId,
              Translation: translation,
              ChapterId: chapterId,
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
              form={word.WordId + "-" + word.TranslationId}
              type="text"
              name="hanzi"
              id="hanzi"
              defaultValue={word.Hanzi}
            />
          </td>
          <td>
            <input
              form={word.WordId + "-" + word.TranslationId}
              type="text"
              name="pinyin"
              id="pinyin"
              defaultValue={word.Pinyin}
            />
          </td>
          <td>
            <input
              form={word.WordId + "-" + word.TranslationId}
              type="text"
              name="translation"
              id="translation"
              defaultValue={word.Translation}
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
              id={word.WordId + "-" + word.TranslationId}
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
          <td>{word.Translation}</td>
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

import React from "react";
import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";
import cancel_icon from "../assets/images/cancel.png";
import confirmation_icon from "../assets/images/confirmation.png";

function WordList({ words, setWords }) {
  return (
    <>
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
            words.map((word, index) => (
              <Item word={word} words={words} setWords={setWords} />
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

function Item({ word, words, setWords }) {
  const [editing, setEditing] = React.useState(false);

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
    setWords((prevWords) =>
      prevWords.map((aWord) =>
        aWord.id === word.id
          ? {
              ...aWord,
              hanzi: event.target.hanzi.value,
              pinyin: event.target.pinyin.value,
              translation: event.target.translation.value,
            }
          : aWord,
      ),
    );

    const updatedWords = words.map((aWord) =>
      aWord.id === word.id
        ? {
            ...aWord,
            hanzi: event.target.hanzi.value,
            pinyin: event.target.pinyin.value,
            translation: event.target.translation.value,
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
              defaultValue={word.hanzi}
            />
          </td>
          <td>
            <input
              form={word.id}
              type="text"
              name="pinyin"
              id="pinyin"
              defaultValue={word.pinyin}
            />
          </td>
          <td>
            <input
              form={word.id}
              type="text"
              name="translation"
              id="translation"
              defaultValue={word.translation}
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
          <td>{word.hanzi}</td>
          <td>{word.pinyin}</td>
          <td>{word.translation}</td>
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

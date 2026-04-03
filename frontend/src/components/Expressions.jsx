import React from "react";
import { pinyin } from "pinyin-pro";
import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";
import cancel_icon from "../assets/images/cancel.png";
import confirmation_icon from "../assets/images/confirmation.png";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";

function ExpressionsList({ expressions, setExpressions }) {
  const [chapter, setChapter] = React.useState("all");

  return (
    <>
      {/* <ChapterSelect
        chapters={chapters}
        defaultChapter={chapter}
        setChapter={setChapter}
      /> */}
      <table className="expressionsList">
        <thead>
          <tr>
            <th>Hanzi</th>
            <th>Pinyin</th>
            <th>Translation</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {expressions && expressions.length > 0 ? (
            expressions
              .filter(
                (expression) =>
                  chapter === "all" ||
                  (chapter === "no-chapter" && "" === expression.Chapter) ||
                  parseInt(chapter) === expression.ChapterID,
              )
              .map((expression, index) => (
                <Item
                  expression={expression}
                  expressions={expressions}
                  setExpressions={setExpressions}
                  // chapters={chapters}
                />
              ))
          ) : (
            <tr>
              <td colSpan={3}>No expressions yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default ExpressionsList;

function Item({ expression, expressions, setExpressions, chapters }) {
  const [editing, setEditing] = React.useState(false);
  // const [editChapter, setEditChapter] = React.useState(expression.ChapterName);

  const deleteEntry = async () => {
    // TODO receive success or fail to update or not the data and show a toast
    await axios.delete("http://localhost:8081/words/delete", {
      // params here since it's delete and not post
      params: {
        ExpressionID: expression.ExpressionID,
        TranslationID: expression.TranslationID,
      },
    });
    // Updates the visible data
    setExpressions((prevExpressions) =>
      prevExpressions.filter(
        (anExpression) =>
          anExpression.ExpressionID !== expression.ExpressionID &&
          anExpression.TranslationID !== expression.TranslationID,
      ),
    );
  };

  // TODO make edit expression function
  const editEntry = (event) => {
    event.preventDefault();
    setEditing(true);
  };

  const editSubmit = async (event) => {
    event.preventDefault();

    const hanzi = event.target.hanzi.value;
    // If the pinyin value was edited, we take this one, else, we get the pinyin with pinyin-pro
    const pinyinVal =
      (event.target.pinyin.value === expression.pinyin &&
        hanzi !== expression.hanzi) ||
      event.target.pinyin.value === ""
        ? pinyin(hanzi)
        : event.target.pinyin.value;
    const translation = event.target.translation.value;
    // console.log(chapters);
    // const chapterName = chapters.filter(
    //   (chapter) => chapter.ChapterID === parseInt(editChapter),
    // )[0].ChapterName;
    // console.log(chapterName);

    const res = await axios.patch("http://localhost:8081/words/modify", {
      expressionId: expression.ExpressionID,
      translationId: expression.TranslationID,
      newHanzi: hanzi,
      newPinyin: pinyinVal,
      // newChapterId: editChapter,
      newTranslation: translation,
      expressionTranslationId: expression.ExpressionTranslationID,
    });

    setExpressions((prevExpressions) =>
      prevExpressions.map((anExpression) =>
        anExpression.ExpressionID === expression.ExpressionID
          ? {
              ...anExpression,
              ExpressionID: res.data.expressionId,
              Hanzi: hanzi,
              Pinyin: pinyinVal,
              TranslationID: res.data.translationId,
              Translation: translation,
              // ChapterID: editChapter,
              // ChapterName: chapterName,
            }
          : anExpression,
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
              form={expression.ExpressionID + "-" + expression.TranslationID}
              type="text"
              name="hanzi"
              id="hanzi"
              defaultValue={expression.Hanzi}
            />
          </td>
          <td>
            <input
              form={expression.ExpressionID + "-" + expression.TranslationID}
              type="text"
              name="pinyin"
              id="pinyin"
              defaultValue={expression.Pinyin}
            />
          </td>
          <td>
            <input
              form={expression.ExpressionID + "-" + expression.TranslationID}
              type="text"
              name="translation"
              id="translation"
              defaultValue={expression.Translation}
            />
          </td>
          {/* <td>
            <ChapterSelect
              chapters={chapters}
              defaultChapter={editChapter}
              setChapter={setEditChapter}
              allChapters={false}
            />
          </td> */}
          <td className="options">
            <form
              id={expression.ExpressionID + "-" + expression.TranslationID}
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
          <td>{expression.Hanzi}</td>
          <td>{expression.Pinyin}</td>
          <td>{expression.Translation}</td>
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

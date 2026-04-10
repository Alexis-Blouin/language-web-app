import React from "react";
import { pinyin } from "pinyin-pro";
import { TableVirtuoso } from "react-virtuoso";
import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";
import cancel_icon from "../assets/images/cancel.png";
import confirmation_icon from "../assets/images/confirmation.png";
import ChapterSelect from "./ChapterSelect";
import EditForm from "./EditForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function WordList({ words, setWords, chapters }) {
  const [chapter, setChapter] = React.useState("all");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalWord, setModalWord] = React.useState(null);

  const filteredWords = words
    ? words.filter(
        (word) =>
          chapter === "all" ||
          (chapter === "no-chapter" && "" === word.Chapter) ||
          parseInt(chapter) === word.ChapterId,
      )
    : [];

  const columns = [
    { key: "hanzi", label: "Hanzi", width: 100 },
    { key: "pinyin", label: "Pinyin", width: 150 },
    { key: "translation", label: "Translation", width: 200 },
    { key: "chapter", label: "Chapter", width: 100 },
    { key: "options", label: "Options", width: 100 },
  ];

  return (
    <>
      <ChapterSelect
        chapters={chapters}
        defaultChapter={chapter}
        setChapter={setChapter}
      />

      <Paper style={{ marginTop: "20px", height: "600px", width: "650px" }}>
        <TableVirtuoso
          data={filteredWords}
          // overscan={8}
          style={{ height: "600px", width: "650px" }}
          fixedHeaderContent={() => (
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  variant="head"
                  style={{ width: col.width, padding: "8px" }}
                  sx={{ backgroundColor: "background.paper" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          )}
          itemContent={(index, word) => (
            <Item
              word={word}
              words={words}
              setWords={setWords}
              chapters={chapters}
              handleOpen={handleOpen}
              setModalWord={setModalWord}
            />
          )}
          noDataComponent={() => (
            <React.Fragment>
              <TableCell
                colSpan={5}
                style={{ textAlign: "center", padding: "20px" }}
              >
                No words yet.
              </TableCell>
            </React.Fragment>
          )}
        />
      </Paper>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default WordList;

function Item({ word, words, setWords, chapters, handleOpen, setModalWord }) {
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
    <React.Fragment>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {word.Hanzi}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {word.Pinyin}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "left" }}>
        {word.Translation}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {word.ChapterName}
      </TableCell>
      <TableCell className="options" style={{ padding: "8px" }}>
        <button
          className="icon-button"
          onClick={() => {
            setModalWord(word);
            handleOpen();
          }}
        >
          <img src={edit_icon} alt="Edit" />
        </button>
        <button className="icon-button" onClick={deleteEntry}>
          <img src={delete_icon} alt="Delete" />
        </button>
      </TableCell>
    </React.Fragment>
  );
}

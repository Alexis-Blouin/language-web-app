import React from "react";
import { pinyin } from "pinyin-pro";
import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";
import cancel_icon from "../assets/images/cancel.png";
import confirmation_icon from "../assets/images/confirmation.png";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { TableVirtuoso } from "react-virtuoso";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteDialog from "./DeleteDialog";
import EditForm from "./EditForm";
import Button from "@mui/material/Button";

function ExpressionsList({
  expressions,
  setExpressions,
  chapters,
  categories,
}) {
  const [chapter, setChapter] = React.useState("all");
  const [open, setOpen] = React.useState(false);
  const handleOpen = (word) => {
    setModalWord(word);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [modalWord, setModalWord] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const handleDeleteClick = (word) => {
    setModalWord(word);
    setDeleteDialogOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteConfirm = async () => {
    // TODO receive success or fail to update or not the data and show a toast
    await axios.delete("http://localhost:8081/words/delete", {
      // params here since it's delete and not post
      params: {
        WordId: modalWord.WordId,
        TranslationId: modalWord.TranslationId,
      },
    });
    // Updates the visible data
    setExpressions((prevWords) =>
      prevWords.filter(
        (aWord) =>
          !(
            aWord.WordId === modalWord.WordId &&
            aWord.TranslationId === modalWord.TranslationId
          ),
      ),
    );
    setDeleteDialogOpen(false);
  };

  const filteredExpressions = expressions
    ? expressions.filter(
        (word) =>
          chapter === "all" ||
          (chapter === "no-chapter" && "" === word.Chapter) ||
          parseInt(chapter) === word.ChapterId,
      )
    : [];

  const searchFilteredExpressions = search
    ? filteredExpressions.filter(
        (word) =>
          word.Hanzi.toLowerCase().includes(search.toLowerCase()) ||
          word.Pinyin.toLowerCase()
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .includes(search) ||
          word.Translation.toLowerCase().includes(search.toLowerCase()),
      )
    : filteredExpressions;

  const columns = [
    { key: "hanzi", label: "Hanzi", width: 300 },
    { key: "pinyin", label: "Pinyin", width: 200 },
    { key: "translation", label: "Translation", width: 300 },
    { key: "options", label: "Options", width: 100 },
  ];

  return (
    <Stack
      direction="column"
      sx={{ width: "50%", margin: "20px auto", justifyContent: "center" }}
      spacing={2}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
        }}
        spacing={2}
      >
        {/* <ChapterSelect
          chapters={chapters}
          defaultChapter={chapter}
          setChapter={setChapter}
        /> */}
        <TextField
          label="Search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>
      <Paper
        style={{ height: "100%", marginLeft: "auto", marginRight: "auto" }}
      >
        <TableVirtuoso
          data={searchFilteredExpressions}
          // overscan={8}
          style={{ width: "850px", height: "600px" }}
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
          itemContent={(index, expression) => (
            <Item
              expression={expression}
              expressions={expressions}
              setExpressions={setExpressions}
              chapters={chapters}
              handleOpen={handleOpen}
              setModalWord={setModalWord}
              handleDeleteClick={handleDeleteClick}
            />
          )}
          noDataComponent={() => (
            <React.Fragment>
              <TableCell
                colSpan={5}
                style={{ textAlign: "center", padding: "20px" }}
              >
                No expressions yet.
              </TableCell>
            </React.Fragment>
          )}
        />
      </Paper>
      <EditForm
        word={modalWord}
        chapters={chapters}
        categories={categories}
        setExpressions={setExpressions}
        handleClose={handleClose}
        open={open}
        action="Expression"
      />
      {/* TODO toast not appear anymore when deleting */}
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        content={modalWord?.Hanzi}
        action="Expression"
      />
    </Stack>
  );
}

export default ExpressionsList;

function Item({
  expression,
  expressions,
  setExpressions,
  chapters,
  handleOpen,
  setModalWord,
  handleDeleteClick,
}) {
  const [editing, setEditing] = React.useState(false);
  // const [editChapter, setEditChapter] = React.useState(expression.ChapterName);

  const deleteEntry = async () => {
    // TODO receive success or fail to update or not the data and show a toast
    await axios.delete("http://localhost:8081/words/delete", {
      // params here since it's delete and not post
      params: {
        ExpressionId: expression.ExpressionId,
        TranslationId: expression.TranslationId,
      },
    });
    // Updates the visible data
    setExpressions((prevExpressions) =>
      prevExpressions.filter(
        (anExpression) =>
          anExpression.ExpressionId !== expression.ExpressionId &&
          anExpression.TranslationId !== expression.TranslationId,
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
    //   (chapter) => chapter.ChapterId === parseInt(editChapter),
    // )[0].ChapterName;
    // console.log(chapterName);

    const res = await axios.patch("http://localhost:8081/words/modify", {
      expressionId: expression.ExpressionId,
      translationId: expression.TranslationId,
      newHanzi: hanzi,
      newPinyin: pinyinVal,
      // newChapterId: editChapter,
      newTranslation: translation,
      expressionTranslationId: expression.ExpressionTranslationId,
    });

    setExpressions((prevExpressions) =>
      prevExpressions.map((anExpression) =>
        anExpression.ExpressionId === expression.ExpressionId
          ? {
              ...anExpression,
              ExpressionId: res.data.expressionId,
              Hanzi: hanzi,
              Pinyin: pinyinVal,
              TranslationId: res.data.translationId,
              Translation: translation,
              // ChapterId: editChapter,
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

  return (
    <React.Fragment>
      <TableCell
        style={{ padding: "8px", alignContent: "center", fontSize: "24px" }}
      >
        {expression.Hanzi}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {expression.Pinyin}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "left" }}>
        {expression.Translation}
      </TableCell>
      {/* <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {expression.ChapterName}
      </TableCell> */}
      <TableCell
        className="options"
        style={{ padding: "8px", textAlign: "center" }}
      >
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button onClick={() => handleOpen(expression)}>
            <EditSquareIcon />
          </Button>
          <Button onClick={() => handleDeleteClick(expression)}>
            <DeleteForeverIcon />
          </Button>
        </Stack>
      </TableCell>
    </React.Fragment>
  );
}

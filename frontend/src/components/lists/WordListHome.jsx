import React from "react";
import { pinyin } from "pinyin-pro";
import { TableVirtuoso } from "react-virtuoso";
import ChapterSelect from "../inputs/ChapterSelect";
import EditForm from "../words/EditForm";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteDialog from "../dialogs/DeleteDialog";
import TextField from "@mui/material/TextField";
import CategorySelect from "../inputs/CategorySelect";
import toast from "react-simple-toasts";

function WordList({ words, setWords, chapters, categories, setCategories }) {
  const [chapter, setChapter] = React.useState("all");
  const [category, setCategory] = React.useState("all");
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
        wordId: modalWord.wordId,
        translationId: modalWord.translationId,
      },
    });
    // Updates the visible data
    setWords((prevWords) =>
      prevWords.filter(
        (aWord) =>
          !(
            aWord.wordId === modalWord.wordId &&
            aWord.translationId === modalWord.translationId
          ),
      ),
    );
    setDeleteDialogOpen(false);
    toast("Word Deleted!", { theme: "success" });
  };

  const filteredWords = words
    ? words.filter(
        (word) =>
          (chapter === "all" ||
            (chapter === "no-chapter" && "" === word.chapter) ||
            parseInt(chapter) === word.chapterId) &&
          (category === "all" ||
            (category === "no-category" && !word.categoryId) ||
            parseInt(category) === word.categoryId),
      )
    : [];

  const searchFilteredWords = search
    ? filteredWords.filter(
        (word) =>
          word.hanzi.toLowerCase().includes(search.toLowerCase()) ||
          word.pinyin
            .toLowerCase()
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .includes(search) ||
          word.translation.toLowerCase().includes(search.toLowerCase()),
      )
    : filteredWords;

  const columns = [
    { key: "hanzi", label: "Hanzi", width: 200 },
    { key: "pinyin", label: "Pinyin", width: 150 },
    { key: "translation", label: "Translation", width: 200 },
    { key: "chapter", label: "Chapter", width: 100 },
    { key: "category", label: "Category", width: 150 },
    { key: "options", label: "Options", width: 100 },
  ];

  return (
    <Stack
      direction="column"
      sx={{ width: "50%", margin: "16px auto", justifyContent: "center" }}
      spacing={2}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
        }}
        spacing={2}
      >
        <ChapterSelect
          chapters={chapters}
          defaultChapter={chapter}
          setChapter={setChapter}
        />
        <CategorySelect
          categories={categories}
          defaultCategory={category}
          setCategory={setCategory}
        />
        <TextField
          label="Search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      <Paper
        style={{
          width: "900px",
          height:
            "calc(100vh - 176px)" /* Full monitor size - header and filters */,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TableVirtuoso
          data={searchFilteredWords}
          // overscan={8}
          style={{ width: "100%", height: "100%", borderRadius: "4px" }}
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
              handleDeleteClick={handleDeleteClick}
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
      <EditForm
        word={modalWord}
        chapters={chapters}
        categories={categories}
        setCategories={setCategories}
        setWords={setWords}
        handleClose={handleClose}
        open={open}
        action="Word"
      />
      {/* TODO toast not appear anymore when deleting */}
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        content={modalWord?.hanzi}
        action="Word"
      />
    </Stack>
  );
}

export default WordList;

function Item({
  word,
  words,
  setWords,
  chapters,
  handleOpen,
  setModalWord,
  handleDeleteClick,
}) {
  return (
    <React.Fragment>
      <TableCell
        style={{ padding: "8px", alignContent: "center", fontSize: "24px" }}
      >
        {word.hanzi}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {word.pinyin}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "left" }}>
        {word.translation}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {word.chapterName}
      </TableCell>
      <TableCell style={{ padding: "8px", alignContent: "center" }}>
        {word.categoryName}
      </TableCell>
      <TableCell
        className="options"
        style={{ padding: "8px", textAlign: "center" }}
      >
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button onClick={() => handleOpen(word)}>
            <EditSquareIcon />
          </Button>
          <Button onClick={() => handleDeleteClick(word)}>
            <DeleteForeverIcon />
          </Button>
        </Stack>
      </TableCell>
    </React.Fragment>
  );
}

import React from "react";
import { TableVirtuoso } from "react-virtuoso";
import ChapterSelect from "./ChapterSelect";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

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
  ];

  return (
    <>
      <ChapterSelect
        chapters={chapters}
        defaultChapter={chapter}
        setChapter={setChapter}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="hanzi"
              checked={hiddenColumns.hanzi}
              onChange={handleHiddenColumnChange}
            />
          }
          label="Hanzi"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="pinyin"
              checked={hiddenColumns.pinyin}
              onChange={handleHiddenColumnChange}
            />
          }
          label="Pinyin"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="translation"
              checked={hiddenColumns.translation}
              onChange={handleHiddenColumnChange}
            />
          }
          label="Translation"
        />
      </FormGroup>
      <Paper style={{ marginTop: "20px", height: "600px", width: "450px" }}>
        <TableVirtuoso
          data={filteredWords}
          // overscan={8}
          style={{ height: "600px", width: "450px" }}
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
            <Item word={word} hiddenColumns={hiddenColumns} />
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
    </>
  );
}

export default WordListHidden;

function Item({ word, hiddenColumns }) {
  const unhideWord = (target) => {
    target.target.classList.remove("hidden-word");
  };

  return (
    <React.Fragment>
      <TableCell
        className={hiddenColumns.hanzi ? "hidden-word" : ""}
        onClick={unhideWord}
        style={{ padding: "8px", alignContent: "center" }}
      >
        {word.Hanzi}
      </TableCell>
      <TableCell
        className={hiddenColumns.pinyin ? "hidden-word" : ""}
        onClick={unhideWord}
        style={{ padding: "8px", alignContent: "center" }}
      >
        {word.Pinyin}
      </TableCell>
      <TableCell
        className={hiddenColumns.translation ? "hidden-word" : ""}
        onClick={unhideWord}
        style={{ padding: "8px", alignContent: "left" }}
      >
        {word.Translation}
      </TableCell>
    </React.Fragment>
  );
}

import React from "react";
import { TableVirtuoso } from "react-virtuoso";
import ChapterSelect from "./ChapterSelect";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import ReplayIcon from "@mui/icons-material/Replay";
import Button from "@mui/material/Button";
import CategorySelect from "./CategorySelect";

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

function WordListHidden({ words, chapters, categories }) {
  const [chapter, setChapter] = React.useState("all");
  const [category, setCategory] = React.useState("all");
  const [hiddenColumns, setHiddenColumns] = React.useState({
    hanzi: false,
    pinyin: false,
    translation: true,
  });
  const [showingColumns, setShowingColumns] = React.useState({});
  const [hiddingColumns, setHiddingColumns] = React.useState({});

  const handleHiddenColumnChange = (e) => {
    const column = e.target.name;
    const willHide = e.target.checked;

    if (willHide) {
      setHiddenColumns((values) => ({ ...values, [column]: true }));
      setHiddingColumns((prev) => ({ ...prev, [column]: true }));
      setTimeout(() => {
        setHiddingColumns((prev) => ({ ...prev, [column]: false }));
      }, 500);
    } else {
      setShowingColumns((prev) => ({ ...prev, [column]: true }));
      setHiddenColumns((values) => ({ ...values, [column]: false }));
      setTimeout(() => {
        setShowingColumns((prev) => ({ ...prev, [column]: false }));
      }, 500);
    }
  };

  const resetHidden = () => {
    for (const [key, value] of Object.entries(hiddenColumns)) {
      if (value) {
        setHiddingColumns((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setHiddingColumns((prev) => ({ ...prev, [key]: false }));
        }, 500);
      }
    }
  };

  const filteredWords = words
    ? words.filter(
        (word) =>
          (chapter === "all" ||
            (chapter === "no-chapter" && "" === word.Chapter) ||
            parseInt(chapter) === word.ChapterId) &&
          (category === "all" ||
            (category === "no-category" && !word.CategoryId) ||
            parseInt(category) === word.CategoryId),
      )
    : [];

  const columns = [
    { key: "hanzi", label: "Hanzi", width: 100 },
    { key: "pinyin", label: "Pinyin", width: 150 },
    { key: "translation", label: "Translation", width: 200 },
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
        <ChapterSelect
          chapters={chapters}
          defaultChapter={chapter}
          setChapter={setChapter}
          onChange={resetHidden}
        />
        <CategorySelect
          categories={categories}
          defaultCategory={category}
          setCategory={setCategory}
          onChange={resetHidden}
        />
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={resetHidden}
        >
          Reset Hidden
        </Button>
      </Stack>
      <Paper
        style={{ height: "100%", marginLeft: "auto", marginRight: "auto" }}
      >
        <TableVirtuoso
          data={filteredWords}
          // overscan={8}
          style={{ width: "450px", height: "600px" }}
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
                  <Checkbox
                    id={col.label.toLowerCase()}
                    name={col.label.toLowerCase()}
                    checked={hiddenColumns[col.key]}
                    onChange={handleHiddenColumnChange}
                  />
                </TableCell>
              ))}
            </TableRow>
          )}
          itemContent={(index, word) => (
            <Item
              word={word}
              hiddenColumns={hiddenColumns}
              transitioningColumns={showingColumns}
              test={hiddingColumns}
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
    </Stack>
  );
}

export default WordListHidden;

function Item({ word, hiddenColumns, transitioningColumns, test }) {
  const unhideWord = (target) => {
    const cell = target.target;
    cell.classList.add("fade-out");
    setTimeout(() => {
      cell.classList.remove("hidden-word", "fade-out");
    }, 500);
  };

  const getClassName = (columnKey) => {
    if (test[columnKey]) return "hidden-word fade-in";
    if (transitioningColumns[columnKey]) return "hidden-word fade-out";
    return hiddenColumns[columnKey] ? "hidden-word" : "";
  };

  return (
    <React.Fragment>
      <TableCell
        className={getClassName("hanzi")}
        onClick={unhideWord}
        style={{ padding: "8px", alignContent: "center" }}
      >
        {word.Hanzi}
      </TableCell>
      <TableCell
        className={getClassName("pinyin")}
        onClick={unhideWord}
        style={{ padding: "8px", alignContent: "center" }}
      >
        {word.Pinyin}
      </TableCell>
      <TableCell
        className={getClassName("translation")}
        onClick={unhideWord}
        style={{ padding: "8px", alignContent: "left" }}
      >
        {word.Translation}
      </TableCell>
    </React.Fragment>
  );
}

import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";

function EditForm({
  setWords,
  setExpressions,
  chapters,
  setChapters,
  word,
  handleClose,
  open,
}) {
  const [hanzi, setHanzi] = React.useState(word?.Hanzi);
  const [pinyinVal, setPinyinVal] = React.useState(word?.Pinyin);
  const [translation, setTranslation] = React.useState(word?.Translation);
  const [chapter, setChapter] = React.useState(word?.ChapterId); // Default value is 1
  const [newChapter, setNewChapter] = React.useState();

  // Update form fields when the word changes
  React.useEffect(() => {
    if (word) {
      setHanzi(word.Hanzi);
      setPinyinVal(word.Pinyin);
      setTranslation(word.Translation);
      setChapter(word.ChapterId);
    }
  }, [word]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pinyinInput = event.target.pinyin.value;
    // If the pinyin value was edited, we take this one, else, we get the pinyin with pinyin-pro
    const pinyinVal =
      (pinyinInput === word.Pinyin && hanzi !== word.Hanzi) ||
      pinyinInput === ""
        ? pinyin(hanzi)
        : pinyinInput;

    let chapterId = chapter;
    // TODO this is a bit hacky, maybe change the chapter select to return the chapter name instead of id, or both and use the name for the toast and the id for the db query
    let chapterName = chapters.filter(
      (chap) => chap.ChapterId === parseInt(chapter),
    )[0]?.ChapterName;
    try {
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

      handleClose();
    } catch (err) {
      console.error(err);
    }
    // // Resets for next word
    // setHanzi("");
    // setPinyinVal("");
    // setTranslation("");
    // // reset chapter select to proper chapter as well after adding
    // setNewChapter("");
    // if (chapter === "new-chapter") {
    //   setChapter(chapterId);
    // }
    toast("Word Modified!", { theme: "success" });
  };

  const handleHanziChange = (event) => {
    setHanzi(event.target.value);
  };

  const handlePinyinChange = (event) => {
    setPinyinVal(event.target.value);
  };

  const handleTranslationChange = (event) => {
    setTranslation(event.target.value);
  };

  const handleNewChapterChange = (event) => {
    setNewChapter(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Word "{word?.Hanzi}"</DialogTitle>
      <DialogContent style={{ paddingTop: "5px" }}>
        <form id="editForm" onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column" alignItems="center">
            <TextField
              required
              id="hanzi"
              name="hanzi"
              label="Hanzi"
              placeholder="你好"
              value={hanzi}
              onChange={handleHanziChange}
            />
            <TextField
              id="pinyin"
              name="pinyin"
              label="Pinyin"
              placeholder="nǐhǎo"
              value={pinyinVal}
              onChange={handlePinyinChange}
            />
            <TextField
              required
              id="translation"
              name="translation"
              label="Translation"
              placeholder="Hello"
              value={translation}
              onChange={handleTranslationChange}
            />
            {chapter === "new-chapter" && (
              <TextField
                required
                id="new-chapter"
                name="new-chapter"
                label="New Chapter Name"
                placeholder="1"
                value={newChapter}
                onChange={handleNewChapterChange}
              />
            )}
            <ChapterSelect
              chapters={chapters}
              defaultChapter={chapter}
              setChapter={setChapter}
              id="chapter-add-form"
              allChapters={false}
              newChapter={true}
            />
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          form="editForm"
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditForm;

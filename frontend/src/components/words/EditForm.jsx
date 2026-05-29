import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";
import ChapterSelect from "../inputs/ChapterSelect";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import CategorySelect from "../inputs/CategorySelect";

function EditForm({
  setWords,
  setExpressions,
  chapters,
  setChapters,
  categories,
  setCategories,
  word,
  handleClose,
  open,
  action,
}) {
  const [hanzi, setHanzi] = React.useState();
  const [pinyinVal, setPinyinVal] = React.useState();
  const [translation, setTranslation] = React.useState();
  const [chapter, setChapter] = React.useState();
  const [newChapter, setNewChapter] = React.useState();
  const [category, setCategory] = React.useState();
  const [newCategory, setNewCategory] = React.useState();

  // Update form fields when the word changes
  React.useEffect(() => {
    if (word) {
      setHanzi(word.hanzi);
      setPinyinVal(word.pinyin);
      setTranslation(word.translation);
      setChapter(word.chapterId);
      setCategory(word.categoryId);
    }
  }, [word]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pinyinInput = event.target.pinyin.value;
    // If the pinyin value was edited, we take this one, else, we get the pinyin with pinyin-pro
    const pinyinVal =
      (pinyinInput === word.pinyin && hanzi !== word.hanzi) ||
      pinyinInput === ""
        ? pinyin(hanzi)
        : pinyinInput;

    let chapterId = chapter;
    // TODO this is a bit hacky, maybe change the chapter select to return the chapter name instead of id, or both and use the name for the toast and the id for the db query
    let chapterName = chapters.filter(
      (chap) => chap.chapterId === parseInt(chapter),
    )[0]?.chapterName;
    let categoryId = category;
    let categoryName = categories.filter(
      (cat) => cat.categoryId === parseInt(category),
    )[0]?.categoryName;
    try {
      if (chapter === "new-chapter") {
        const res = await axios.post("http://localhost:8081/chapters/add", {
          chapterName: newChapter,
        });
        chapterId = res.data.chapterId;
        const added = res.data.added;
        chapterName = newChapter;

        // If the chapter was added, we add it to the list, else, it means it was already there
        if (added) {
          const newChapterEntry = {
            chapterId: parseInt(chapterId),
            chapterName: newChapter,
          };
          setChapters((prevChapters) => [...prevChapters, newChapterEntry]);
        }
      } else if (chapter === "no-chapter") {
        chapterId = null;
      }
      if (category === "new-category") {
        const res = await axios.post("http://localhost:8081/categories/add", {
          categoryName: newCategory,
        });
        categoryId = res.data.categoryId;
        const added = res.data.added;
        categoryName = newCategory;

        if (added) {
          const newCategoryEntry = {
            categoryId: parseInt(categoryId),
            categoryName: newCategory,
          };
          setCategories((prevCategories) => [
            ...prevCategories,
            newCategoryEntry,
          ]);
        }
      } else if (category === "no-category") {
        categoryId = null;
      }

      const res = await axios.patch("http://localhost:8081/words/modify", {
        wordId: word.WordId,
        translationId: word.translationId,
        newHanzi: hanzi,
        newPinyin: pinyinVal,
        newChapterId: chapterId,
        newCategoryId: categoryId,
        newTranslation: translation,
        wordTranslationId: word.WordTranslationId,
        typeId: word.TypeId,
      });

      if (action === "Word") {
        setWords((prevWords) =>
          prevWords.map((aWord) =>
            aWord.WordId === word.WordId &&
            aWord.translationId === word.translationId
              ? {
                  ...aWord,
                  WordId: res.data.wordId,
                  hanzi: hanzi,
                  pinyin: pinyinVal,
                  translationId: res.data.translationId,
                  translation: translation,
                  chapterId: chapterId,
                  chapterName: chapterName,
                  categoryId: categoryId,
                  categoryName: categoryName,
                }
              : aWord,
          ),
        );
      } else {
        setExpressions((prevExpressions) =>
          prevExpressions.map((aExpression) =>
            aExpression.WordId === word.WordId &&
            aExpression.translationId === word.translationId
              ? {
                  ...aExpression,
                  WordId: res.data.wordId,
                  hanzi: hanzi,
                  pinyin: pinyinVal,
                  translationId: res.data.translationId,
                  translation: translation,
                  chapterId: chapterId,
                  chapterName: chapterName,
                  categoryId: categoryId,
                  categoryName: categoryName,
                }
              : aExpression,
          ),
        );
      }

      handleClose();
    } catch (err) {
      console.error(err);
    }

    toast(`${action} Modified!`, { theme: "success" });
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

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Edit {action} "{word?.hanzi}"
      </DialogTitle>
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
            {category === "new-category" && (
              <TextField
                required
                id="new-category"
                name="new-category"
                label="New Category Name"
                placeholder="Fruit"
                value={newCategory}
                onChange={handleNewCategoryChange}
              />
            )}
            <CategorySelect
              categories={categories}
              defaultCategory={category}
              setCategory={setCategory}
              id="category-add-form"
              allCategories={false}
              newCategory={true}
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

import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";
import ChapterSelect from "./ChapterSelect";
import CategorySelect from "./CategorySelect";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";

function AddForm({
  setWords,
  setExpressions,
  chapters,
  setChapters,
  categories,
  setCategories,
  types,
}) {
  const [hanzi, setHanzi] = React.useState("");
  const [pinyinVal, setPinyinVal] = React.useState("");
  const [translation, setTranslation] = React.useState("");
  const [chapter, setChapter] = React.useState(1); // Default value is 1
  const [newChapter, setNewChapter] = React.useState("");
  const [category, setCategory] = React.useState(1); // Default value is 1
  const [newCategory, setNewCategory] = React.useState("");
  const [typeVal, setTypeVal] = React.useState(1); // Default value is 1

  const handleSubmit = async (event) => {
    event.preventDefault();
    // If no pinyin value is entered, will get the one from pinyin-pro
    if (pinyinVal === "" || pinyinVal === undefined) {
      setPinyinVal(pinyin(hanzi));
    }

    let chapterId = chapter;
    // TODO this is a bit hacky, maybe change the chapter select to return the chapter name instead of id, or both and use the name for the toast and the id for the db query
    let chapterName = chapters.filter(
      (chap) => chap.ChapterId === parseInt(chapter),
    )[0]?.ChapterName;
    let categoryId = category;
    let categoryName = categories.filter(
      (cat) => cat.CategoryId === parseInt(category),
    )[0]?.CategoryName;
    try {
      if (chapter === "new-chapter") {
        const res = await axios.post("http://localhost:8081/chapters/add", {
          ChapterName: newChapter,
        });
        chapterId = res.data;
        chapterName = newChapter;

        const newChapterEntry = {
          ChapterId: parseInt(chapterId),
          ChapterName: newChapter,
        };
        setChapters((prevChapters) => [...prevChapters, newChapterEntry]);
      } else if (chapter === "no-chapter") {
        chapterId = null;
      }
      // TODO still add the word if the chapter already exists
      if (category === "new-category") {
        const res = await axios.post("http://localhost:8081/categories/add", {
          CategoryName: newCategory,
        });
        categoryId = res.data;
        categoryName = newCategory;

        const newCategoryEntry = {
          CategoryId: parseInt(categoryId),
          CategoryName: newCategory,
        };
        setCategories((prevCategories) => [
          ...prevCategories,
          newCategoryEntry,
        ]);
      } else if (category === "no-category") {
        categoryId = null;
      }

      const translations = translation.includes(";")
        ? translation.split(";")
        : [translation];

      // Loops for each possible translation
      for (const tr of translations) {
        const res = await axios.post("http://localhost:8081/words/add", {
          Hanzi: hanzi,
          Pinyin:
            pinyinVal === "" || pinyinVal === undefined
              ? pinyin(hanzi)
              : pinyinVal,
          ChapterId: chapterId,
          CategoryId: categoryId,
          Translation: tr,
          TypeId: typeVal,
        });
        const wordId = res.data.wordId;
        const translationId = res.data.translationId;
        // TODO the word can't properly be deleted from the table without a page reload (deletes from page, but not db)
        const newWordEntry = {
          WordId: wordId,
          Hanzi: hanzi,
          Pinyin:
            pinyinVal === "" || pinyinVal === undefined
              ? pinyin(hanzi)
              : pinyinVal,
          TranslationId: translationId,
          Translation: tr,
          ChapterId: parseInt(chapterId),
          ChapterName: chapterName,
          CategoryId: parseInt(categoryId),
          CategoryName: categoryName,
          TypeId: typeVal,
        };
        // Adds the new word/expression to the proper list depending on the type
        if (typeVal === 1) {
          setWords((prevWords) => [...prevWords, newWordEntry]);
        } else {
          setExpressions((prevExpressions) => [
            ...prevExpressions,
            newWordEntry,
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    }
    // Resets for next word
    setHanzi("");
    setPinyinVal("");
    setTranslation("");
    // reset chapter and category select to proper chapter as well after adding
    setNewChapter("");
    if (chapter === "new-chapter") {
      setChapter(chapterId);
    }
    setNewCategory("");
    if (category === "new-category") {
      setCategory(categoryId);
    }
    toast("Word Added!", { theme: "success" });
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
    <Box sx={{ width: "400px", mt: 2, mr: "auto", ml: "auto" }}>
      <form id="addForm" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2} alignItems="center">
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
          <FormControl>
            <FormLabel id="type-radio-buttons-group-label">Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              {types.map((type, index) => (
                <FormControlLabel
                  key={index}
                  value={type.TypeId}
                  control={
                    <Radio
                      name="type"
                      id={type.TypeId}
                      checked={typeVal === type.TypeId}
                      onClick={() => setTypeVal(type.TypeId)}
                    />
                  }
                  label={type.TypeName}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Add
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default AddForm;

import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";

function AddForm({ setWords, setExpressions, chapters, setChapters, types }) {
  const [hanzi, setHanzi] = React.useState();
  const [pinyinVal, setPinyinVal] = React.useState();
  const [translation, setTranslation] = React.useState();
  const [chapter, setChapter] = React.useState(1); // Default value is 1
  const [newChapter, setNewChapter] = React.useState();
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
    // reset chapter select to proper chapter as well after adding
    setNewChapter("");
    if (chapter === "new-chapter") {
      setChapter(chapterId);
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

  return (
    <form id="addForm" onSubmit={handleSubmit}>
      <label htmlFor="hanzi">
        Hanzi:
        <input
          type="text"
          name="hanzi"
          id="hanzi"
          placeholder="你好"
          value={hanzi}
          onChange={handleHanziChange}
          required
        />
      </label>
      <label htmlFor="pinyin">
        Pinyin:
        <input
          type="text"
          name="pinyin"
          id="pinyin"
          placeholder="nǐhǎo"
          value={pinyinVal}
          onChange={handlePinyinChange}
        />
      </label>
      <label htmlFor="translation">
        Translation:
        <input
          type="text"
          name="translation"
          id="translation"
          placeholder="Hello"
          value={translation}
          onChange={handleTranslationChange}
          required
        />
      </label>
      <label htmlFor="chapter">
        Chapter:
        {chapter === "new-chapter" && (
          <input
            type="text"
            name="translation"
            id="translation"
            placeholder="1"
            value={newChapter}
            onChange={handleNewChapterChange}
            required
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
      </label>
      {types.map((type, index) => (
        <label htmlFor={type.TypeId}>
          {type.TypeName}
          <input
            type="radio"
            name="type"
            id={type.TypeId}
            value={type.TypeId}
            checked={typeVal === type.TypeId} // TODO check default chapter 1
            onClick={() => setTypeVal(type.TypeId)}
          />
        </label>
      ))}
      <button id="addButton">Add</button>
    </form>
  );
}

export default AddForm;

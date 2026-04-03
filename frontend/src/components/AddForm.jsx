import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";

function AddForm({ words, setWords, chapters, setChapters, types }) {
  const [hanzi, setHanzi] = React.useState();
  const [pinyinVal, setPinyinVal] = React.useState();
  const [translation, setTranslation] = React.useState();
  const [chapter, setChapter] = React.useState(1); // Default value is 1
  const [newChapter, setNewChapter] = React.useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // If no pinyin value is entered, will get the one from pinyin-pro
    if (pinyinVal === "" || pinyinVal === undefined) {
      setPinyinVal(pinyin(hanzi));
    }

    let chapterId = chapter;
    try {
      if (chapter === "new-chapter") {
        const res = await axios.post("http://localhost:8081/chapters/add", {
          ChapterName: newChapter,
        });
        chapterId = res.data;

        const newChapterEntry = {
          ChapterID: parseInt(chapterId),
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
          ChapterID: chapterId,
          Translation: tr,
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
          TranslationID: translationId,
          Translation: tr,
          ChapterID: parseInt(chapterId),
          ChapterName: chapter === "new-chapter" ? newChapter : chapter,
        };
        setWords((prevWords) => [...prevWords, newWordEntry]);
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
        <label htmlFor={type.TypeID}>
          {type.TypeName}
          <input
            type="radio"
            name="type"
            id={type.TypeID}
            value={type.TypeID}
            //checked={type.TypeID === 1} // TODO check default chapter 1
          />
        </label>
      ))}
      <button id="addButton">Add</button>
    </form>
  );
}

export default AddForm;

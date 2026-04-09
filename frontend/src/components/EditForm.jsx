import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";
import ChapterSelect from "./ChapterSelect";
import axios from "axios";

function EditForm({ setWords, setExpressions, chapters, setChapters, word }) {
  const [hanzi, setHanzi] = React.useState(word.Hanzi);
  const [pinyinVal, setPinyinVal] = React.useState(word.Pinyin);
  const [translation, setTranslation] = React.useState(word.Translation);
  const [chapter, setChapter] = React.useState(word.ChapterId); // Default value is 1
  const [newChapter, setNewChapter] = React.useState();
  const [typeVal, setTypeVal] = React.useState(1); // Default value is 1

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
          newChapter={false}
        />
      </label>
      <button id="addButton">Confirm</button>
    </form>
  );
}

export default EditForm;

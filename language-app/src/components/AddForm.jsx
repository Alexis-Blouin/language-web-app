import { pinyin } from "pinyin-pro";
import React from "react";
import toast from "react-simple-toasts";

function AddForm({ words, setWords, chapters }) {
  const [hanzi, setHanzi] = React.useState();
  const [pinyinVal, setPinyinVal] = React.useState();
  const [translation, setTranslation] = React.useState();
  const [chapter, setChapter] = React.useState(1); // Default value is 1
  const [newChapter, setNewChapter] = React.useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    // If no pinyin value is entered, will get the one from pinyin-pro
    if (pinyinVal === "" || pinyinVal === undefined) {
      setPinyinVal(pinyin(hanzi));
    }
    const newWord = {
      id: crypto.randomUUID(),
      hanzi: hanzi,
      pinyin:
        pinyinVal === "" || pinyinVal === undefined ? pinyin(hanzi) : pinyinVal,
      translation: translation,
      chapter: chapter === "add" ? newChapter : chapter,
    };
    setWords((prevWords) => [...prevWords, newWord]);
    localStorage.setItem("words", JSON.stringify([...words, newWord]));
    setHanzi("");
    setPinyinVal("");
    setTranslation("");
    // TODO reset chapter select to proper chapter as well after adding
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

  const handleChapterChange = (event) => {
    setChapter(event.target.value);
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
        {chapter === "add" && (
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
        <select name="chapter" id="chapter" onChange={handleChapterChange}>
          {chapters.map((chapter, index) => (
            <ChapterOption value={index} option={chapter} />
          ))}
          {<ChapterOption value="add" option="Add Chapter" />}
        </select>
      </label>
      <button id="addButton">Add</button>
    </form>
  );
}

export default AddForm;

function ChapterOption({ value, option }) {
  return <option value={value}>{option}</option>;
}

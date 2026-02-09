import { pinyin } from "pinyin-pro";
import React from "react";

function AddForm({ words, setWords }) {
  const [hanzi, setHanzi] = React.useState();
  const [pinyinVal, setPinyinVal] = React.useState();
  const [translation, setTranslation] = React.useState();
  const [chapter, setChapter] = React.useState(1); // Default value is 1

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
      chapter: chapter,
    };
    setWords((prevWords) => [...prevWords, newWord]);
    localStorage.setItem("words", JSON.stringify([...words, newWord]));
    event.target.reset();
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
        <select name="chapter" id="chapter" onChange={handleChapterChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>
      <button id="addButton">Add</button>
    </form>
  );
}

export default AddForm;

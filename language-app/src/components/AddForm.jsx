function AddForm({ words, setWords }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const hanzi = event.target.hanzi.value;
    const pinyin = event.target.pinyin.value;
    const translation = event.target.translation.value;
    const newWord = { hanzi: hanzi, pinyin: pinyin, translation: translation };
    setWords((prevWords) => [...prevWords, newWord]);
    localStorage.setItem("words", JSON.stringify([...words, newWord]));
    event.target.reset();
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
          required
        />
      </label>
      <label htmlFor="pinyin">
        Pinyin:
        <input type="text" name="pinyin" id="pinyin" placeholder="nǐhǎo" />
      </label>
      <label htmlFor="translation">
        Translation:
        <input
          type="text"
          name="translation"
          id="translation"
          placeholder="Hello"
          required
        />
      </label>
      <button id="addButton">Add</button>
    </form>
  );
}

export default AddForm;

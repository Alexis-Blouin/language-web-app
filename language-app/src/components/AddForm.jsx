function AddForm({ words, setWords }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const hanzi = event.target.hanzi.value;
    const trslt = event.target.trslt.value;
    setWords((prevWords) => [...prevWords, { hanzi: hanzi, trslt: trslt }]);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="hanzi">
        Hanzi:
        <input type="text" name="hanzi" id="hanzi" placeholder="你好" />
      </label>
      <label htmlFor="trslt">
        Translation:
        <input type="text" name="trslt" id="trslt" placeholder="Hello" />
      </label>
      <button>Add</button>
    </form>
  );
}

export default AddForm;

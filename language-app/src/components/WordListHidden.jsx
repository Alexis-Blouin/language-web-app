function WordListHidden({ words }) {
  return (
    <ul>
      {words && words.length > 0 ? (
        words.map((word, index) => <Item word={word} />)
      ) : (
        <p>No words yet.</p>
      )}
    </ul>
  );
}

export default WordListHidden;

function Item({ word }) {
  const unhideWord = (target) => {
    console.log(target);
    target.target.classList.remove("hidden-word");
  };

  return (
    <li>
      {word.hanzi} -{" "}
      <span className="hidden-word" onClick={unhideWord}>
        {word.translation}
      </span>
    </li>
  );
}

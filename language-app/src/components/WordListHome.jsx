function WordList({ words }) {
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

export default WordList;

function Item({ word }) {
  return (
    <li>
      {word.hanzi} - {word.trslt}
    </li>
  );
}

import delete_icon from "../assets/images/delete.png";
import edit_icon from "../assets/images/edit.png";

function WordList({ words, setWords }) {
  return (
    <table className="wordList">
      <thead>
        <tr>
          <th>Hanzi</th>
          <th>Pinyin</th>
          <th>Translation</th>
        </tr>
      </thead>
      <tbody>
        {words && words.length > 0 ? (
          words.map((word, index) => (
            <Item word={word} words={words} setWords={setWords} />
          ))
        ) : (
          <tr>
            <td colSpan={3}>No words yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default WordList;

function Item({ word, words, setWords }) {
  const deleteEntry = () => {
    setWords((prevWords) => prevWords.filter((aWord) => aWord.id !== word.id));
    const updatedWords = JSON.stringify(
      words.filter((aWord) => aWord.id !== word.id),
    );
    localStorage.setItem("words", updatedWords);
  };

  // TODO make edit word function
  const editEntry = () => {
    console.log("Edit");
  };

  //<a href="https://www.flaticon.com/free-icons/edit" title="edit icons">Edit icons created by Pixel perfect - Flaticon</a>
  //<a href="https://www.flaticon.com/free-icons/delete" title="delete icons">Delete icons created by Ilham Fitrotul Hayat - Flaticon</a>
  return (
    <tr>
      <td>{word.hanzi}</td>
      <td>{word.pinyin}</td>
      <td>{word.translation}</td>
      <td className="options">
        <button className="icon-button" onClick={editEntry}>
          <img src={edit_icon} alt="Edit" />
        </button>
        <button className="icon-button" onClick={deleteEntry}>
          <img src={delete_icon} alt="Delete" />
        </button>
      </td>
    </tr>
  );
}

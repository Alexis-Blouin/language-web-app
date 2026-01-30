function WordGuess({ words }) {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const hideHanzi = Math.random() < 0.5;
  const [question, answer] = hideHanzi
    ? [randomWord.trslt, randomWord.hanzi]
    : [randomWord.hanzi, randomWord.trslt];

  const handleSubmit = (event) => {
    event.preventDefault();
    const guess = event.target.guess.value;
    if (guess === answer) {
      console.log("Correct!");
    } else {
      console.log("Incorrect...");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="guess">
        What is {question}:
        <input type="text" name="guess" id="guess" placeholder="answer" />
      </label>
    </form>
  );
}

export default WordGuess;

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";

function CreateSentence() {
  const [sentence, setSentence] = useState("");
  const [question, setQuestion] = useState("");

  const [corrected, setCorrected] = useState("");
  const [grammar, setGrammar] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState([]);
  const [answer, setAnswer] = useState([]);

  const handleSentenceChange = (event) => {
    setSentence(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await axios.post("http://localhost:8081/ai/analyze", {
      sentence,
      question,
    });

    const resObj = JSON.parse(res.data);
    console.log(resObj);

    setCorrected(resObj.corrected);
    setGrammar(resObj.grammar_feedback);
    setVocabulary(resObj.vocabulary_feedback);
    setScore(resObj.score);
    setExplanation(resObj.explanation);
    setAnswer(resObj.question_answer);
  };

  const handleClear = () => {
    setCorrected("");
    setGrammar("");
    setVocabulary("");
    setScore("");
    setExplanation("");
    setAnswer("");
  };

  return (
    <Box sx={{ width: "400px", mt: 2, mr: "auto", ml: "auto" }}>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h4">Test your writing skills</Typography>
            <Typography variant="body2">
              Write some text and get feedback on it. You can also ask a
              question in the same context.
            </Typography>
            <TextField
              required
              id="sentence"
              name="sentence"
              label="Sentence"
              placeholder="我很好…"
              value={sentence}
              onChange={handleSentenceChange}
            />
            <TextField
              id="question"
              name="question"
              label="Question"
              placeholder="Is this sentence correct"
              value={question}
              onChange={handleQuestionChange}
            />
            <Button variant="contained" color="primary" type="submit">
              Ask
            </Button>
          </Stack>
        </form>
      </Paper>
      {corrected !== "" && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Stack direction="column" spacing={2}>
            {sentence !== corrected && (
              <Box>
                <Typography variant="h5">Corrected Sentence</Typography>
                <Typography variant="body1">{corrected}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="h5">Grammar</Typography>
              {grammar.map((gram) => (
                <Typography variant="body1">{gram}</Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="h5">Vocabulary</Typography>
              {vocabulary.map((vocab) => (
                <Typography variant="body1">{vocab}</Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="h5">Score</Typography>
              <Typography variant="body1">{score}</Typography>
            </Box>
            <Box>
              <Typography variant="h5">Explanation</Typography>
              {explanation.map((exp) => (
                <Typography variant="body1">{exp}</Typography>
              ))}
            </Box>
            {question !== "" && (
              <>
                <Typography variant="h5">Answer to your question</Typography>
                {answer.map((an) => (
                  <Typography variant="body1">{an}</Typography>
                ))}
              </>
            )}
            <Button variant="contained" color="primary" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

export default CreateSentence;

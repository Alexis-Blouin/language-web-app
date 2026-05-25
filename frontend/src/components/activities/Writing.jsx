import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";

function Writing() {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");

  const [inProgress, setInProgress] = useState(false);

  const [corrected, setCorrected] = useState("");
  const [grammar, setGrammar] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState([]);
  const [answer, setAnswer] = useState([]);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClear();
    setInProgress(true);

    try {
      const res = await axios.post("http://localhost:8081/ai/analyze", {
        sentence: text,
        question,
      });

      // Sometimes the response comes with ```json around it, so we need to clean it before parsing
      const clean = res.data.replace(/```json|```/g, "").trim();
      const resObj = JSON.parse(clean);

      setCorrected(resObj.corrected);
      setGrammar(resObj.grammar_feedback);
      setVocabulary(resObj.vocabulary_feedback);
      setScore(resObj.score);
      setExplanation(resObj.explanation);
      setAnswer(resObj.question_answer);
    } finally {
      setInProgress(false);
    }
  };

  const handleClear = () => {
    setCorrected("");
    setGrammar([]);
    setVocabulary([]);
    setScore(0);
    setExplanation([]);
    setAnswer([]);
  };

  return (
    <Box sx={{ maxWidth: "800px", p: 2, mr: "auto", ml: "auto" }}>
      <Stack direction="column" spacing={2}>
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h4">Test Your Writing Skills</Typography>
              <Typography variant="body2">
                Write some text and get feedback on it. You can also ask a
                question in the same context.
              </Typography>
              <TextField
                required
                multiline
                minRows={2}
                id="text"
                name="text"
                label="Text"
                placeholder="今天我很好…"
                value={text}
                onChange={handleTextChange}
                autoComplete="off"
              />
              <TextField
                multiline
                minRows={2}
                id="question"
                name="question"
                label="Question"
                placeholder="What can I change to improve this?"
                value={question}
                onChange={handleQuestionChange}
                autoComplete="off"
              />
              <Button
                sx={{ maxWidth: "100px" }}
                variant="contained"
                color="primary"
                type="submit"
                disabled={inProgress}
              >
                Ask
              </Button>
            </Stack>
          </form>
        </Paper>
        {inProgress && <CircularProgress sx={{ alignSelf: "center" }} />}
        {grammar.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
              {text !== corrected && (
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
                <Typography variant="body1">{score}/10</Typography>
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
              <Button
                sx={{ maxWidth: "100px" }}
                variant="contained"
                color="primary"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

export default Writing;

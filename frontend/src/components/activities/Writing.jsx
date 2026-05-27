import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import toast from "react-simple-toasts";

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

  const [canSave, setCanSave] = useState(true);

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
        text,
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
    // setText("");
    // setQuestion("");
    setCorrected("");
    setGrammar([]);
    setVocabulary([]);
    setScore(0);
    setExplanation([]);
    setAnswer([]);
  };

  const saveQuery = async () => {
    setCanSave(false);
    try {
      const res = await axios.post("http://localhost:8081/ai/add", {
        originalText: text,
        question,
        correctedText: corrected,
        grammarFeedback: grammar,
        vocabularyFeedback: vocabulary,
        explanation,
        answer,
        score,
      });

      if (res.data.success) {
        toast(res.data.message, { theme: "success" });
      } else {
        toast(res.data.message, { theme: "failure" });
        setCanSave(true);
      }
    } catch (err) {
      console.error(err);
      setCanSave(true);
    }
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
              <Box>
                <Button
                  sx={{ maxWidth: "100px" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={inProgress}
                >
                  Ask
                </Button>
                <Link
                  component={RouterLink}
                  to="/queries"
                  variant="button"
                  underline="hover"
                  sx={{ ml: 2 }}
                >
                  See Previous Queries
                </Link>
              </Box>
            </Stack>
          </form>
        </Paper>
        {inProgress && <CircularProgress sx={{ alignSelf: "center" }} />}
        {grammar.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
              {text !== corrected && (
                <Box>
                  <Typography variant="h5">Corrected Text</Typography>
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
              <Box>
                <Button
                  sx={{ maxWidth: "100px" }}
                  variant="contained"
                  color="primary"
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  sx={{ maxWidth: "100px", ml: 2 }}
                  variant="contained"
                  color="primary"
                  onClick={saveQuery}
                  disabled={canSave}
                >
                  Save
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

export default Writing;

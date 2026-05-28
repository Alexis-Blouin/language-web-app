import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import DeleteDialog from "../words/DeleteDialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import toast from "react-simple-toasts";
import ScoreProgressBar from "./ScoreProgressBar";

function Queries() {
  const [queries, setQueries] = useState([]);
  const [openQuery, setOpenQuery] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const handleOpen = (query) => {
    setSelectedQuery(query);
    setOpenQuery(true);
  };
  const handleClose = () => setOpenQuery(false);
  useEffect(() => {
    axios
      .get("http://localhost:8081/ai/get")
      .then((res) => setQueries(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box sx={{ margin: "16px auto", width: "75%" }}>
      <Grid container spacing={2}>
        {queries.map((query) => (
          <Query query={query} handleOpen={handleOpen} />
        ))}
      </Grid>
      <FocusedQuery
        query={selectedQuery}
        setQueries={setQueries}
        open={openQuery}
        handleClose={handleClose}
      />
    </Box>
  );
}

export default Queries;

function Query({ query, handleOpen }) {
  const originalText =
    query.originalText.length > 20
      ? query.originalText.substring(0, 20) + "..."
      : query.originalText;
  const correctedText =
    query.correctedText.length > 20
      ? query.correctedText.substring(0, 20) + "..."
      : query.correctedText;
  const explanations = query.explanation
    .slice(0, 3)
    .map((exp) => (exp.length > 100 ? exp.substring(0, 100) + "..." : exp));
  const displayExplanations =
    query.explanation.length > 3 ? [...explanations, "..."] : explanations;
  const score = query.score;

  return (
    <Grid size={{ md: 4 }}>
      <Paper sx={{ p: 2, cursor: "pointer" }} onClick={() => handleOpen(query)}>
        <Stack spacing={1} direction="column">
          <Typography variant="h4">{originalText}</Typography>
          {correctedText !== originalText && (
            <>
              <Divider textAlign="left">Corrected Text</Divider>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {correctedText}
              </Typography>
            </>
          )}
          <Divider textAlign="left">Explanation</Divider>
          {displayExplanations.map((exp) => (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {exp}
            </Typography>
          ))}
          <Divider textAlign="left">Score</Divider>
          <ScoreProgressBar score={score} />
        </Stack>
      </Paper>
    </Grid>
  );
}

function FocusedQuery({ query, setQueries, open, handleClose }) {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const [corrected, setCorrected] = useState("");
  const [grammar, setGrammar] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState([]);
  const [answer, setAnswer] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete("http://localhost:8081/ai/delete", {
        params: { queryId: query.queryId },
      });

      if (res.data.success) {
        setQueries((prevQueries) =>
          prevQueries.filter((q) => q.queryId !== query.queryId),
        );
        handleClose();
        setDeleteDialogOpen(false);
        toast(res.data.message, { theme: "success" });
      } else {
        // TODO not handled since the backend currently always returns success for delete
      }
    } catch (err) {
      console.error(err);
      toast("Failed to delete note. Please try again.", { theme: "failure" });
    }
  };

  useEffect(() => {
    if (query) {
      setText(query.originalText);
      setQuestion(query.question);
      setCorrected(query.correctedText);
      setGrammar(query.grammarFeedback);
      setVocabulary(query.vocabularyFeedback);
      setExplanation(query.explanation);
      setAnswer(query.answer);
      setScore(query.score);
    }
  }, [query]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{corrected}</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Stack direction="column" spacing={2}>
          {text !== corrected && (
            <Box>
              <Divider textAlign="left" sx={{ mb: 1 }}>
                Corrected Version
              </Divider>
              <Typography variant="body1">{corrected}</Typography>
            </Box>
          )}
          {grammar.length > 0 && (
            <Box>
              <Divider textAlign="left" sx={{ mb: 1 }}>
                Grammar
              </Divider>
              {grammar.map((gram) => (
                <Typography variant="body1">{gram}</Typography>
              ))}
            </Box>
          )}
          {vocabulary.length > 0 && (
            <Box>
              <Divider textAlign="left" sx={{ mb: 1 }}>
                Vocabulary
              </Divider>
              {vocabulary.map((vocab) => (
                <Typography variant="body1">{vocab}</Typography>
              ))}
            </Box>
          )}
          <Box>
            <Divider textAlign="left" sx={{ mb: 1 }}>
              Explanation
            </Divider>
            {explanation.map((exp) => (
              <Typography variant="body1">{exp}</Typography>
            ))}
          </Box>
          <Box>
            <Divider textAlign="left" sx={{ mb: 1 }}>
              Score
            </Divider>
            <ScoreProgressBar score={score} />
          </Box>
          {question !== "" && (
            <>
              <Box>
                <Divider textAlign="left" sx={{ mb: 1 }}>
                  Question
                </Divider>
                <Typography variant="body1">{question}</Typography>
              </Box>
              <Box>
                <Divider textAlign="left" sx={{ mb: 1 }}>
                  Answer to your question
                </Divider>
                {answer.map((an) => (
                  <Typography variant="body1">{an}</Typography>
                ))}
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClick}>
          <DeleteForeverIcon />
        </Button>
      </DialogActions>
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        content={query?.correctedText}
        action="Query"
      />
    </Dialog>
  );
}

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
          <Item query={query} handleOpen={handleOpen} />
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

function Item({ query, handleOpen }) {
  return (
    <Grid size={{ md: 4 }}>
      <Paper sx={{ p: 2, cursor: "pointer" }} onClick={() => handleOpen(query)}>
        <Stack spacing={1} direction="column">
          <Typography variant="h4">{query.originalText}</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {query.question.length > 100
              ? query.question.substring(0, 100) + "..."
              : query.question}
          </Typography>
          <Divider textAlign="left">Example</Divider>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {query.correctedText.length > 100
              ? query.correctedText.substring(0, 100) + "..."
              : query.correctedText}
          </Typography>
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
        <Box>
          <Typography variant="h5">Original Text</Typography>
          <Typography variant="body1">{corrected}</Typography>
        </Box>
        {question !== "" && (
          <Box>
            <Typography variant="h5">Question</Typography>
            <Typography variant="body1">{question}</Typography>
          </Box>
        )}
      </DialogTitle>
      <DialogContent>
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

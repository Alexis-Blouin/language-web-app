import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

function ScoreProgressBar({ score }) {
  const color = score >= 8 ? "success" : score >= 5 ? "warning" : "error";

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={score * 10}
          color={color}
        />
      </Box>
      <Box sx={{ whiteSpace: "nowrap" }}>
        <Typography variant="body2">{score}/10</Typography>
      </Box>
    </Box>
  );
}

export default ScoreProgressBar;

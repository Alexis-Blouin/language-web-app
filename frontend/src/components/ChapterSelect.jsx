import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function ChapterSelect({
  chapters,
  defaultChapter,
  setChapter,
  allChapters = true,
  newChapter = false,
}) {
  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, maxWidth: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Chapter</InputLabel>
        <Select
          name="chapter"
          labelId="demo-simple-select-label"
          id=""
          value={defaultChapter}
          label="Chapter"
          onChange={handleChapterChange}
        >
          {allChapters && <MenuItem value="all">All Chapters</MenuItem>}
          {chapters.map((chapter) => (
            <MenuItem key={chapter.ChapterId} value={chapter.ChapterId}>
              {chapter.ChapterName}
            </MenuItem>
          ))}
          {newChapter && <MenuItem value="new-chapter">New Chapter</MenuItem>}
        </Select>
      </FormControl>
    </Box>
  );
}

export default ChapterSelect;

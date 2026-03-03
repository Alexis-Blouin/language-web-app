function ChapterSelect({
  chapters,
  defaultChapter,
  setChapter,
  id = "",
  allChapters = true,
  noChapter = true,
  newChapter = false,
}) {
  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  return (
    <select
      name="chapter"
      id={id}
      value={defaultChapter}
      onChange={handleChapterChange}
    >
      {allChapters && <option value="all">All Chapters</option>}

      {chapters.map((chapter) => (
        <option key={chapter} value={chapter}>
          {chapter}
        </option>
      ))}

      {noChapter && <option value="no-chapter">No Chapter</option>}
      {newChapter && <option value="new-chapter">New Chapter</option>}
    </select>
  );
}

export default ChapterSelect;

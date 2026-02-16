function ChapterSelect({
  chapters,
  defaultChapter,
  setChapter,
  allChapters = true,
  noChapter = true,
}) {
  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  return (
    <select
      name="chapter"
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
    </select>
  );
}

export default ChapterSelect;

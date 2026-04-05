function ChapterSelect({
  chapters,
  defaultChapter,
  setChapter,
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
      id=""
      value={defaultChapter}
      onChange={handleChapterChange}
    >
      {allChapters && <option value="all">All Chapters</option>}

      {chapters.map((chapter) => (
        <option key={chapter.ChapterId} value={chapter.ChapterId}>
          {chapter.ChapterName}
        </option>
      ))}

      {noChapter && <option value="no-chapter">No Chapter</option>}
      {newChapter && <option value="new-chapter">New Chapter</option>}
    </select>
  );
}

export default ChapterSelect;

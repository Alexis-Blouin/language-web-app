function Filters({ chapters, chapter, setChapter }) {
  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  return (
    <select name="chapter" id="chapterFilter" onChange={handleChapterChange}>
      {<ChapterOption value="all" option="All Chapters" />}
      {chapters.map((chapter, index) => (
        <ChapterOption value={chapter} option={chapter} />
      ))}
      {<ChapterOption value="no-chapter" option="No Chapter" />}
    </select>
  );
}

export default Filters;

function ChapterOption({ value, option }) {
  return <option value={value}>{option}</option>;
}

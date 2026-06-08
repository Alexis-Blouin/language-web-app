import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Grid from "@mui/material/Grid";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Input from "@mui/material/Input";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import toast from "react-simple-toasts";
import axios from "axios";
import DeleteDialog from "../dialogs/DeleteDialog";

function Profile({
  wordsCount,
  setWords,
  expressionsCount,
  notesCount,
  chaptersCount,
  categoriesCount,
  chapters,
  setChapters,
  categories,
  setCategories,
}) {
  const [newChapters, setNewChapters] = useState(chapters);
  const [newCategories, setNewCategories] = useState(categories);
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [currentItemType, setCurrentItemType] = useState(null);
  const handleOpen = (type) => {
    setCurrentItemType(type);
    if (type === "Chapter") {
      setOpen(true);
    } else {
      setCategoriesOpen(true);
    }
  };
  const handleClose = () => {
    resetChanges();
    setOpen(false);
  };

  const handleCategoriesClose = () => {
    resetChanges();
    setCategoriesOpen(false);
  };

  const handleChapterChange = (event) => {
    const { name, value } = event.target;
    setNewChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter.chapterId === parseInt(name)
          ? { ...chapter, chapterName: value }
          : chapter,
      ),
    );
  };

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setNewCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.categoryId === parseInt(name)
          ? { ...category, categoryName: value }
          : category,
      ),
    );
  };

  const { user } = useAuth();

  useEffect(() => {
    resetChanges();
  }, [chapters, categories]);

  const resetChanges = () => {
    if (chapters) setNewChapters([...chapters]);
    if (categories) setNewCategories([...categories]);
  };

  const saveChanges = async () => {
    try {
      const res =
        currentItemType === "Chapter"
          ? await axios.post("http://localhost:8081/chapters/update", {
              chapters: newChapters,
            })
          : await axios.post("http://localhost:8081/categories/update", {
              categories: newCategories,
            });

      if (res.data.success) {
        setChapters([...newChapters]);
        setCategories([...newCategories]);
        setOpen(false);
        setCategoriesOpen(false);
        toast("Changes Saved!", { theme: "success" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (currentItemType === "Chapter") {
        const res = await axios.delete(
          "http://localhost:8081/chapters/delete",
          {
            params: { chapterId: deleteItem.chapterId },
          },
        );

        if (res.data.success) {
          setWords((prevWords) =>
            prevWords.map((word) =>
              word.chapterId === deleteItem.chapterId
                ? {
                    ...word,
                    chapterId: res.data.defaultChapterId,
                    chapterName: res.data.defaultChapterName,
                  }
                : word,
            ),
          );

          setChapters((prevChapters) =>
            prevChapters.filter((c) => c.chapterId !== deleteItem.chapterId),
          );
          setNewChapters((prevChapters) =>
            prevChapters.filter((c) => c.chapterId !== deleteItem.chapterId),
          );
          toast("Chapter Deleted!", { theme: "success" });
        }
      } else {
        const res = await axios.delete(
          "http://localhost:8081/categories/delete",
          {
            params: { categoryId: deleteItem.categoryId },
          },
        );

        if (res.data.success) {
          setWords((prevWords) =>
            prevWords.map((word) =>
              word.categoryId === deleteItem.categoryId
                ? {
                    ...word,
                    categoryId: res.data.defaultCategoryId,
                    categoryName: res.data.defaultCategoryName,
                  }
                : word,
            ),
          );

          setCategories((prevCategories) =>
            prevCategories.filter(
              (c) => c.categoryId !== deleteItem.categoryId,
            ),
          );
          setNewCategories((prevCategories) =>
            prevCategories.filter(
              (c) => c.categoryId !== deleteItem.categoryId,
            ),
          );
          toast("Category Deleted!", { theme: "success" });
        }
      }
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ width: "50%", margin: "16px auto", justifyContent: "center" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Word of The Day</Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">{user?.accountUsername}</Typography>
            <Typography variant="h5">{user?.accountEmail}</Typography>
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Stats</Typography>
            <Typography variant="h5">{wordsCount} Words</Typography>
            <Typography variant="h5">{expressionsCount} Expressions</Typography>
            <Typography variant="h5">{notesCount} Notes</Typography>
            <Typography variant="h5">{chaptersCount} Chapters</Typography>
            <Typography variant="h5">{categoriesCount} Categories</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => handleOpen("Chapter")}>
          Chapters
          <EditSquareIcon sx={{ ml: 1 }} />
        </Button>
        <Button variant="contained" onClick={() => handleOpen("Category")}>
          Categories
          <EditSquareIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Chapters</DialogTitle>
        <DialogContent style={{ paddingTop: "5px" }}>
          <Stack direction="column" spacing={2}>
            {newChapters.map((chapter, index) => (
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  id={chapter.chapterId}
                  name={chapter.chapterId}
                  placeholder="Name"
                  variant="standard"
                  value={chapter.chapterName}
                  onChange={handleChapterChange}
                />
                {chapters[index].chapterName !==
                newChapters[index].chapterName ? (
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>
                      was
                    </Typography>
                    <Typography variant="body1">
                      {chapters[index].chapterName}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body1" sx={{ opacity: 0.5 }}>
                    No change
                  </Typography>
                )}
                <Button onClick={() => handleDeleteClick(chapter)}>
                  <DeleteForeverIcon />
                </Button>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            form="editForm"
            color="primary"
            variant="contained"
            onClick={() => saveChanges()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={categoriesOpen} onClose={handleCategoriesClose}>
        <DialogTitle>Edit Categories</DialogTitle>
        <DialogContent style={{ paddingTop: "5px" }}>
          <Stack direction="column" spacing={2}>
            {newCategories.map((category, index) => (
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  id={category.categoryId}
                  name={category.categoryId}
                  placeholder="Name"
                  variant="standard"
                  value={category.categoryName}
                  onChange={handleCategoryChange}
                />
                {categories[index].categoryName !==
                newCategories[index].categoryName ? (
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>
                      was
                    </Typography>
                    <Typography variant="body1">
                      {categories[index].categoryName}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body1" sx={{ opacity: 0.5 }}>
                    No change
                  </Typography>
                )}
                <Button onClick={() => handleDeleteClick(category)}>
                  <DeleteForeverIcon />
                </Button>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoriesClose}>Cancel</Button>
          <Button
            form="editForm"
            color="primary"
            variant="contained"
            onClick={() => saveChanges()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        content={deleteItem?.chapterName || deleteItem?.categoryName}
        action={currentItemType}
      />
    </Box>
  );
}

export default Profile;

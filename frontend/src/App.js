import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/WordListHome";
import WordListHidden from "./components/WordListHidden";
import AddForm from "./components/AddForm";
import React, { useState, useEffect } from "react";
import WordGuess from "./components/WordGuess";
import Expressions from "./components/Expressions";
import WordAttach from "./components/WordAttach";
import TestComponent from "./components/TestComponent";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Grid from "@mui/material/Grid";
import Notes from "./components/Notes";

// A soft, easy-on-the-eyes theme with a light neutral background and refined colors
const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    primary: {
      main: "#2c3e50",
      light: "#34495e",
      dark: "#1a252f",
    },
    secondary: {
      main: "#3498db",
      light: "#5dade2",
      dark: "#2980b9",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const pages = [
  { name: "Home", path: "/" },
  { name: "Add Words", path: "/add_words" },
  { name: "List Hidden", path: "/list_hidden" },
  { name: "Word Guess", path: "/word_guess" },
  { name: "Expressions", path: "/expressions" },
  { name: "Word Attach", path: "/word_attach" },
  { name: "Notes", path: "/notes" },
  { name: "Test Component", path: "/test" },
];
const settings = ["Profile", "Logout"];

function App() {
  const [words, setWords] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/words/get")
      .then((res) => setWords(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/chapters/get")
      .then((res) => setChapters(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/categories/get")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/words/get", {
        params: { WordTypeId: 2 },
      })
      .then((res) => setExpressions(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/types/get")
      .then((res) => setTypes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Learn Chinese
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {page.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                LOGO
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Routes>
          <Route
            path="/"
            element={
              <WordListHome
                words={words}
                setWords={setWords}
                chapters={chapters}
                categories={categories}
              />
            }
          />
          <Route
            path="/add_words"
            element={
              <AddForm
                setWords={setWords}
                setExpressions={setExpressions}
                chapters={chapters}
                setChapters={setChapters}
                categories={categories}
                setCategories={setCategories}
                types={types}
              />
            }
          />
          <Route
            path="/list_hidden"
            element={
              <WordListHidden
                words={words}
                chapters={chapters}
                categories={categories}
              />
            }
          />
          <Route path="/word_guess" element={<WordGuess words={words} />} />
          <Route
            path="/expressions"
            element={
              <Expressions
                expressions={expressions}
                setExpressions={setExpressions}
                chapters={chapters}
                categories={categories}
              />
            }
          />
          <Route path="/word_attach" element={<WordAttach words={words} />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/test" element={<TestComponent />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

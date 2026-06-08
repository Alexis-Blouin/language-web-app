import "./App.css";
import "react-simple-toasts/dist/style.css"; // Will give a warning, but works anyway.
import "react-simple-toasts/dist/theme/info.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WordListHome from "./components/lists/WordListHome";
import WordListHidden from "./components/lists/WordListHidden";
import AddForm from "./components/words/AddForm";
import React, { useState, useEffect } from "react";
import WordGuess from "./components/activities/WordGuess";
import Expressions from "./components/lists/Expressions";
import WordAttach from "./components/activities/WordAttach";
import Notes from "./components/notes/Notes";
import Writing from "./components/activities/Writing";
import LivePinyin from "./components/activities/LivePinyin";
import Login from "./components/account/Login";
import CreateAccount from "./components/account/CreateAccount";
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
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Grid from "@mui/material/Grid";
import Logout from "./components/account/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import Queries from "./components/activities/Queries";
import Profile from "./components/account/Profile";

axios.defaults.withCredentials = true;

// A soft, easy-on-the-eyes theme with a light neutral background and refined colors
const lightTheme = createTheme({
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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1a1f2e", // deep navy, matches your primary dark
      paper: "#222b3a", // slightly lighter for cards/surfaces
    },
    primary: {
      main: "#5dade2", // your secondary light — pops on dark bg
      light: "#85c1e9",
      dark: "#3498db",
    },
    secondary: {
      main: "#3498db",
      light: "#5dade2",
      dark: "#2980b9",
    },
    text: {
      primary: "#ecf0f1", // soft white, easy on the eyes
      secondary: "#95a5a6", // muted gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const pages = [
  { name: "Home", path: "/" },
  { name: "Add Words", path: "/add-words" },
  { name: "List Hidden", path: "/list-hidden" },
  { name: "Word Guess", path: "/word-guess" },
  { name: "Expressions", path: "/expressions" },
  { name: "Word Attach", path: "/word-attach" },
  { name: "Notes", path: "/notes" },
  { name: "Writing", path: "/writing" },
  { name: "Live Pinyin", path: "/live-pinyin" },
];

function App() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    localStorage.setItem("theme", newValue ? "dark" : "light");
    setIsDark(newValue);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent isDark={isDark} toggleTheme={toggleTheme} />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent({ isDark, toggleTheme }) {
  const [words, setWords] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [types, setTypes] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:8081/words/get", {
        params: { wordTypeId: 1 },
      })
      .then((res) => setWords(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8081/chapters/get")
      .then((res) => setChapters(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8081/categories/get")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8081/words/get", {
        params: { wordTypeId: 2 },
      })
      .then((res) => setExpressions(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8081/notes/get")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8081/types/get")
      .then((res) => setTypes(res.data))
      .catch((err) => console.log(err));
  }, [user]);

  const settings = [
    { name: "Profile", path: "/account/profile" },
    user
      ? { name: "Logout", path: "/account/logout" }
      : { name: "Login", path: "/account/login" },
  ];

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

            <Box sx={{ flexGrow: 0, mr: 1 }}>
              <IconButton onClick={toggleTheme}>
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "primary.dark" }}>
                    {user ? user.accountUsername[0].toUpperCase() : "?"}
                  </Avatar>
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
                  <MenuItem
                    key={setting.name}
                    component={Link}
                    to={setting.path}
                    onClick={handleCloseUserMenu}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Change paths to fit new directories structure */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WordListHome
                words={words}
                setWords={setWords}
                chapters={chapters}
                categories={categories}
                setCategories={setCategories}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-words"
          element={
            <ProtectedRoute>
              <AddForm
                setWords={setWords}
                setExpressions={setExpressions}
                chapters={chapters}
                setChapters={setChapters}
                categories={categories}
                setCategories={setCategories}
                types={types}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-hidden"
          element={
            <ProtectedRoute>
              <WordListHidden
                words={words}
                chapters={chapters}
                categories={categories}
                isDark={isDark}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/word-guess"
          element={
            <ProtectedRoute>
              <WordGuess words={words} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expressions"
          element={
            <ProtectedRoute>
              <Expressions
                expressions={expressions}
                setExpressions={setExpressions}
                chapters={chapters}
                categories={categories}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/word-attach"
          element={
            <ProtectedRoute>
              <WordAttach words={words} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes notes={notes} setNotes={setNotes} />
            </ProtectedRoute>
          }
        />
        <Route path="/writing" element={<Writing />} />
        <Route
          path="/queries"
          element={
            <ProtectedRoute>
              <Queries />
            </ProtectedRoute>
          }
        />
        <Route path="/live-pinyin" element={<LivePinyin />} />
        <Route
          path="/account/profile"
          element={
            <Profile
              wordsCount={words.length}
              expressionsCount={expressions.length}
              notesCount={notes.length}
              chaptersCount={chapters.length}
              categoriesCount={categories.length}
              chapters={chapters}
              setChapters={setChapters}
              categories={categories}
              setCategories={setCategories}
            />
          }
        />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/logout" element={<Logout />} />
        <Route path="/account/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;

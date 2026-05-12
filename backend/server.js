// server.js
// Import required modules
const express = require("express"); // Express framework for handling HTTP requests
const mysql = require("mysql2"); // MySQL2 client for Node.js
const cors = require("cors"); // For web security

// Create an instance of express
const app = express();
app.use(cors());
app.use(express.json());

// Create a connection to the MySQL database
require("dotenv").config();
const db = require("./db");

// Connect to db
db.connect((err) => {
  if (err) {
    console.error("Connection error:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Define a route for the root URL '/'
app.get("/", (req, res) => {
  // Respond with a JSON message
  return res.json("From backend side");
});

// import routes
const wordsRoutes = require("./routes/words");
const chaptersRoutes = require("./routes/chapters");
const typesRoutes = require("./routes/types");
const categoriesRoutes = require("./routes/categories");
const notesRoutes = require("./routes/notes");

// use routes
app.use("/words", wordsRoutes);
app.use("/chapters", chaptersRoutes);
app.use("/types", typesRoutes);
app.use("/categories", categoriesRoutes);
app.use("/notes", notesRoutes);

// Start the server and listen on port 8081
app.listen(8081, () => {
  console.log("Server running on port 8081");
});

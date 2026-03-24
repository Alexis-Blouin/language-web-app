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
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

// Define a route to fetch all persons from the 'persons' table
app.get("/persons", (req, res) => {
  const sql = "select * from persons"; // SQL query to select all persons
  db.query(sql, (err, data) => {
    // Execute the SQL query
    if (err) return res.json(err); // If there's an error, return the error
    return res.json(data); // Otherwise, return the data as JSON
  });
});

// Start the server and listen on port 8081
app.listen(8081, () => {
  console.log("Server running on port 8081");
});

const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query(
      `select accountId, accountUsername, accountEmail, accountPassword from accounts where accountUsername = ? or accountEmail = ?`,
      [username, username],
    );
    if (rows.length > 0) {
      const account = rows[0];
      const match = await bcrypt.compare(password, account.accountPassword);

      if (!match) {
        res.json({
          success: false,
          message: "Incorrect username or password",
        });
        return;
      }

      const token = jwt.sign(
        {
          accountId: account.accountId,
          accountUsername: account.accountUsername,
          accountEmail: account.accountEmail,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      // TODO check to make sure it still work when deploying to production (secure: true)
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "Login successful",
      });
    } else {
      res.json({
        success: false,
        message: "Incorrect username or password",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/create-account", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [rows] = await db.query(
      `select accountId from accounts where accountUsername = ? or accountEmail = ?`,
      [username, email],
    );

    if (rows.length > 0) {
      res.json({
        success: false,
        message: "Username and/or Email already exists",
      });
    } else {
      await db.query(
        `insert into accounts (accountUsername, accountEmail, accountPassword) values (?, ?, ?)`,
        [username, email, hashedPassword],
      );
      res.json({
        success: true,
        message: "Account created successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out" });
});

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    accountId: req.accountId,
    accountUsername: req.accountUsername,
    accountEmail: req.accountEmail,
  });
});

module.exports = router;

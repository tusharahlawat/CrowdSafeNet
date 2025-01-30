const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const csvParser = require("csv-parser");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors()); // Allow CORS for frontend requests

const CSV_FILE =  "C:/Users/HP/Desktop/crowdsafenet/src/login.csv";

// Function to read CSV and return data
const readCSV = () => {
  return new Promise((resolve, reject) => {
    const users = [];
    fs.createReadStream(CSV_FILE)
      .pipe(csvParser())
      .on("data", (row) => users.push(row))
      .on("end", () => resolve(users))
      .on("error", (error) => reject(error));
  });
};

// Endpoint to check login credentials
app.post("/login", async (req, res) => {
  const { userID, password } = req.body;
  try {
    const users = await readCSV();
    const user = users.find(
      (u) => u.userID === userID && u.password === password
    );

    if (user) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Endpoint to create a new account
app.post("/register", async (req, res) => {
  const { userID, password } = req.body;
  if (!userID || !password) {
    return res.status(400).json({ success: false, message: "Fields cannot be empty." });
  }

  const users = await readCSV();
  const userExists = users.some((u) => u.userID === userID);

  if (userExists) {
    return res.status(409).json({ success: false, message: "User already exists!" });
  }

  const newUser = `${userID},${password}\n`;
  fs.appendFile(CSV_FILE, newUser, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error saving user." });
    }
    res.json({ success: true, message: "Account created successfully!" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

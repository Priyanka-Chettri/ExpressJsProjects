// app.js
const express = require("express");
const connectDB = require("./config/dbConfig.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();
const port = 3003;

app.use(express.json());

// Connect to the database
connectDB();

// Use routes
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));

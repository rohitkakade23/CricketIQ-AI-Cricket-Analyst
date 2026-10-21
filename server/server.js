const express = require("express");
const cors = require("cors");
require("dotenv").config();
const playerRoutes = require("./routes/playerRoutes");
const matchRoutes = require("./routes/matchRoutes");
require("./models/Team");
const teamRoutes = require("./routes/teamRoutes");




const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CricketIQ API is running",
  });
});

app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to the CricketIQ Backend API!");
});


// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
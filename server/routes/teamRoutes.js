const express = require("express");

const {
  getTeams,
} = require("../controllers/teamController");

const router = express.Router();

router.get("/", getTeams);

module.exports = router;
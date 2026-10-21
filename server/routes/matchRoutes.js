const express = require("express");

const {
  getMatches,
  getMatchById,
  getAIMatchSummary,
  getMatchAnalytics,
} = require("../controllers/matchController");

const router = express.Router();

router.get("/", getMatches);

router.get(
  "/:id/ai-summary",
  getAIMatchSummary
);

router.get(
  "/:id/analytics",
  getMatchAnalytics
);

router.get("/:id", getMatchById);


module.exports = router;
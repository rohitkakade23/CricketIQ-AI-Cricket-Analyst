const express = require("express");

const {
  createPlayer,
  getPlayers,
  getPlayerById,
  getPlayerStats,
  getPlayerPhaseAnalysis,
  getPlayerBowlingStats,
  comparePlayersController,
  getPlayerBowlingPhaseAnalysis,
  getMatchupAnalysis,
  getMatchupPhaseAnalysis,
  getBowlerHandednessAnalysis,
  getPlayerPerformanceController,
  getAIPlayerSummary,
  getAIPlayerInsights,
  getAIMatchupInsights,
  getTopPerformersController,
  getTopBowlersController,
} = require("../controllers/playerController");

const router = express.Router();

router.post("/", createPlayer);
router.get("/", getPlayers);
router.get("/:id/stats", getPlayerStats);
router.get("/:id/phase-analysis", getPlayerPhaseAnalysis);
router.get("/:id/bowling-stats", getPlayerBowlingStats);
router.get("/compare/:player1Id/:player2Id", comparePlayersController);
router.get("/:id/bowling-phase-analysis", getPlayerBowlingPhaseAnalysis);
router.get("/matchup/:batterId/:bowlerId", getMatchupAnalysis);
router.get("/matchup/:batterId/:bowlerId/phase-analysis", getMatchupPhaseAnalysis);
router.get(
  "/matchup/:batterId/:bowlerId/ai",
  getAIMatchupInsights
);
router.get("/:id/handedness-analysis", getBowlerHandednessAnalysis);
router.get(
  "/:id/performance",
  getPlayerPerformanceController
);
router.get("/:id/ai-summary", getAIPlayerSummary);
router.get("/:id/ai-insights", getAIPlayerInsights);
router.get("/top-performers", getTopPerformersController);
router.get("/top-bowlers", getTopBowlersController);
router.get("/:id", getPlayerById);


module.exports = router;
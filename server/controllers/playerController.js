const Player = require("../models/Player");

const {
  generateAIResponse,
} = require("../services/ai/aiService");

const {
  buildPlayerPrompt,
} = require("../services/ai/playerPrompt");

const {
  buildPlayerInsightsPrompt,
} = require("../services/ai/playerInsightsPrompt");

const {
  buildMatchupPrompt,
} = require("../services/ai/matchupPrompt");

const { getBattingStats,} = require("../services/analytics/battingAnalytics");
const { getPhaseWiseBatting,} = require("../services/analytics/phaseAnalytics");
const { getBowlingStats,} = require("../services/analytics/bowlingAnalytics");
const { comparePlayers,} = require("../services/analytics/playerComparison");
const { getBowlingPhaseStats,} = require("../services/analytics/bowlingPhaseAnalytics");
const { getBatterBowlerMatchup,} = require("../services/analytics/matchupAnalytics");
const { getMatchupPhaseStats,} = require("../services/analytics/matchupPhaseAnalytics");
const { getBowlerVsHandStats,} = require("../services/analytics/handednessAnalytics");
const { getPlayerPerformance,} = require("../services/analytics/performanceAnalytics");
const { getTopPerformers,} = require("../services/analytics/performanceAnalytics");
const {getTopBowlers,} = require("../services/analytics/performanceAnalytics");

const createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);

    res.status(201).json({
      success: true,
      player,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();

    res.status(200).json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayerStats = async (req, res) => {
  try {
    const stats = await getBattingStats(
      req.params.id
    );

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayerPhaseAnalysis = async (req, res) => {
  try {
    const phaseAnalysis =
      await getPhaseWiseBatting(req.params.id);

    res.status(200).json({
      success: true,
      phaseAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayerBowlingStats = async (req, res) => {
  try {
    const stats = await getBowlingStats(
      req.params.id
    );

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const comparePlayersController = async (req, res) => {
  try {
    const { player1Id, player2Id } = req.params;

    const comparison = await comparePlayers(
      player1Id,
      player2Id
    );

    res.status(200).json({
      success: true,
      comparison,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayerBowlingPhaseAnalysis = async (req, res) => {
  try {
    const stats = await getBowlingPhaseStats(req.params.id);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMatchupAnalysis = async (req, res) => {
  try {
    const { batterId, bowlerId } = req.params;

    const matchup = await getBatterBowlerMatchup(
      batterId,
      bowlerId
    );

    res.status(200).json({
      success: true,
      matchup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMatchupPhaseAnalysis = async (req, res) => {
  try {
    const { batterId, bowlerId } = req.params;

    const stats = await getMatchupPhaseStats(
      batterId,
      bowlerId
    );

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAIMatchupInsights = async (req, res) => {
  try {
    const { batterId, bowlerId } = req.params;

    // Find batter
    const batter = await Player.findById(batterId);

    // Find bowler
    const bowler = await Player.findById(bowlerId);

    if (!batter || !bowler) {
      return res.status(404).json({
        success: false,
        message: "Batter or bowler not found",
      });
    }

    // Get real matchup analytics
    const matchup = await getBatterBowlerMatchup(
      batterId,
      bowlerId
    );

    // Get real phase-wise matchup analytics
    const phaseAnalysis = await getMatchupPhaseStats(
      batterId,
      bowlerId
    );

    // Build AI prompt
    const prompt = buildMatchupPrompt({
      batter,
      bowler,
      matchup,
      phaseAnalysis,
    });

    // Send prompt to Gemini
    const aiResponse = await generateAIResponse(prompt);

    // Parse Gemini JSON response
    let insights;

    try {
      let cleanedResponse = aiResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const start = cleanedResponse.indexOf("{");
      const end = cleanedResponse.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("No JSON object found in Gemini response");
      }

      cleanedResponse = cleanedResponse.substring(
        start,
        end + 1
      );

      insights = JSON.parse(cleanedResponse);

    } catch (error) {
      console.error("Failed to parse Gemini matchup JSON:");
      console.error(error);
      console.error("Gemini response:", aiResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid JSON response",
      });
    }

    // Final response
    res.status(200).json({
      success: true,

      batter: {
        id: batter._id,
        name: batter.name,
      },

      bowler: {
        id: bowler._id,
        name: bowler.name,
      },

      matchup,

      phaseAnalysis,

      aiInsights: insights,
    });

  } catch (error) {
    console.error("AI Matchup Insights Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI matchup insights",
      error: error.message,
    });
  }
};

const getBowlerHandednessAnalysis = async (req, res) => {
  try {
    const stats = await getBowlerVsHandStats(
      req.params.id
    );

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlayerPerformanceController = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { competition, season } =
      req.query;

    const performance =
      await getPlayerPerformance(
        id,
        competition,
        season
      );

    res.status(200).json({
      success: true,
      performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAIPlayerSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const { competition, season } = req.query;

    // Find player
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Get player's existing CricketIQ performance analytics
    const performance = await getPlayerPerformance(
      id,
      competition,
      season
    );

    // Build AI prompt
    const prompt = buildPlayerPrompt(
      player,
      performance
    );

    // Generate AI analysis
    const analysis = await generateAIResponse(prompt);

    res.status(200).json({
      success: true,
      player: player.name,
      filters: {
        competition: competition || null,
        season: season || null,
      },
      analysis,
    });

  } catch (error) {
    console.error("AI Player Summary Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI player summary",
      error: error.message,
    });
  }
};

const getAIPlayerInsights = async (req, res) => {
  try {
    const { id } = req.params;

    const { competition, season } = req.query;

    // Find player
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Get existing CricketIQ analytics
    const performance = await getPlayerPerformance(
      id,
      competition,
      season
    );

    const phaseAnalysis = await getPhaseWiseBatting(
      id,
      competition,
      season
    );

    const bowlingPhaseAnalysis = await getBowlingPhaseStats(
      id,
      competition,
      season
    );

    // Build AI prompt
    const prompt = buildPlayerInsightsPrompt(
      player,
      performance,
      phaseAnalysis,
      bowlingPhaseAnalysis
    );

    // Generate AI insights
    const aiResponse = await generateAIResponse(prompt);

    let insights;

    try {
     // Remove markdown code fences if Gemini adds them
    let cleanedResponse = aiResponse
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

     // Find the actual JSON object
     const start = cleanedResponse.indexOf("{");
     const end = cleanedResponse.lastIndexOf("}");

    if (start === -1 || end === -1) {
    throw new Error("No JSON object found in Gemini response");
   }

    cleanedResponse = cleanedResponse.substring(start, end + 1);

    insights = JSON.parse(cleanedResponse);

  }  catch (error) {
   console.error("Failed to parse Gemini JSON:");
   console.error(error);
   console.error("Gemini response:", aiResponse);

   return res.status(500).json({
    success: false,
    message: "AI returned an invalid JSON response",
  });
}

    res.status(200).json({
      success: true,
      player: player.name,
      filters: {
        competition: competition || null,
        season: season || null,
      },
      insights,
    });

  } catch (error) {
    console.error("AI Player Insights Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI player insights",
      error: error.message,
    });
  }
};

const getTopPerformersController = async (req, res) => {
  try {
    const topPerformers = await getTopPerformers();

    res.status(200).json({
      success: true,
      performers: topPerformers,
    });
  } catch (error) {
    console.error("Top performers error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTopBowlersController = async (req, res) => {
  try {
    const topBowlers = await getTopBowlers();

    res.status(200).json({
      success: true,
      bowlers: topBowlers,
    });
  } catch (error) {
    console.error("Top bowlers error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
    

module.exports = {
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
};
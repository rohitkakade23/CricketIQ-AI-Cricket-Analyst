const Player = require("../../models/Player");
const { getBattingStats } = require("./battingAnalytics");
const { getBowlingStats } = require("./bowlingAnalytics");

const comparePlayers = async (player1Id, player2Id) => {
  // Find both players
  const player1 = await Player.findById(player1Id);
  const player2 = await Player.findById(player2Id);

  if (!player1 || !player2) {
    throw new Error("One or both players not found");
  }

  // Get batting stats
  const player1Batting = await getBattingStats(player1Id);
  const player2Batting = await getBattingStats(player2Id);

  // Get bowling stats
  const player1Bowling = await getBowlingStats(player1Id);
  const player2Bowling = await getBowlingStats(player2Id);

  return {
    player1: {
      name: player1.name,
      batting: player1Batting,
      bowling: player1Bowling,
    },

    player2: {
      name: player2.name,
      batting: player2Batting,
      bowling: player2Bowling,
    },
  };
};

module.exports = {
  comparePlayers,
};
const Delivery = require("../../models/Delivery");

const getBowlingStats = async (playerId) => {
  const deliveries = await Delivery.find({
    bowler: playerId,
  });

  let balls = 0;
  let runsConceded = 0;
  let wickets = 0;
  let dotBalls = 0;

  for (const delivery of deliveries) {
    // Check extras
    const extrasType = delivery.extrasType || [];

    const isWide = extrasType.includes("wides");
    const isNoBall = extrasType.includes("noballs");

    // Legal delivery
    if (!isWide && !isNoBall) {
      balls++;
    }

    // Runs conceded by bowler
    let concededRuns = delivery.runs;

    // Byes and leg-byes are NOT charged to bowler
    const isBye = extrasType.includes("byes");
    const isLegBye = extrasType.includes("legbyes");

    if (isBye || isLegBye) {
      concededRuns -= delivery.extras;
    }

    runsConceded += concededRuns;

    // Dot ball
    if (
      delivery.runs === 0 &&
      !isWide &&
      !isNoBall
    ) {
      dotBalls++;
    }

    // Wicket
    if (delivery.wicket) {
      const wicketType = delivery.wicketType;

      // These dismissals don't count as bowler wickets
      const nonBowlerWickets = [
        "retired hurt",
        "retired out",
        "obstructing the field",
      ];

      if (!nonBowlerWickets.includes(wicketType)) {
        wickets++;
      }
    }
  }

  // Convert balls into overs
  const overs =
    Math.floor(balls / 6) +
    "." +
    (balls % 6);

  // Economy = runs / overs
  const economy =
    balls > 0
      ? (runsConceded / (balls / 6))
      : 0;

  // Bowling strike rate = balls / wickets
  const bowlingStrikeRate =
    wickets > 0
      ? balls / wickets
      : 0;

  return {
    balls,
    overs,
    runsConceded,
    wickets,
    dotBalls,

    economy: Number(
      economy.toFixed(2)
    ),

    bowlingStrikeRate: Number(
      bowlingStrikeRate.toFixed(2)
    ),
  };
};

module.exports = {
  getBowlingStats,
};
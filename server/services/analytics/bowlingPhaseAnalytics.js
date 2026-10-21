const Delivery = require("../../models/Delivery");

const getPhase = (over) => {
  if (over <= 5) return "powerplay";
  if (over <= 14) return "middle";
  return "death";
};

const getBowlingPhaseStats = async (playerId) => {
  const deliveries = await Delivery.find({
    bowler: playerId,
  });

  const phases = {
    powerplay: {
      balls: 0,
      runsConceded: 0,
      wickets: 0,
      dotBalls: 0,
    },

    middle: {
      balls: 0,
      runsConceded: 0,
      wickets: 0,
      dotBalls: 0,
    },

    death: {
      balls: 0,
      runsConceded: 0,
      wickets: 0,
      dotBalls: 0,
    },
  };

  for (const delivery of deliveries) {
    const phase = getPhase(delivery.over);
    const stats = phases[phase];

    const extrasType = delivery.extrasType || [];

    const isWide = extrasType.includes("wides");
    const isNoBall = extrasType.includes("noballs");

    // Legal delivery
    if (!isWide && !isNoBall) {
      stats.balls++;
    }

    // Runs conceded by bowler
    let concededRuns = delivery.runs;

    const isBye = extrasType.includes("byes");
    const isLegBye = extrasType.includes("legbyes");

    if (isBye || isLegBye) {
      concededRuns -= delivery.extras;
    }

    stats.runsConceded += concededRuns;

    // Dot ball
    if (
      delivery.runs === 0 &&
      !isWide &&
      !isNoBall
    ) {
      stats.dotBalls++;
    }

    // Wickets
    if (delivery.wicket) {
      const nonBowlerWickets = [
        "retired hurt",
        "retired out",
        "obstructing the field",
      ];

      if (
        !nonBowlerWickets.includes(
          delivery.wicketType
        )
      ) {
        stats.wickets++;
      }
    }
  }

  // Calculate economy for each phase
  for (const phase in phases) {
    const stats = phases[phase];

    stats.economy =
      stats.balls > 0
        ? Number(
            (stats.runsConceded / (stats.balls / 6)).toFixed(2)
          )
        : 0;
  }

  return phases;
};

module.exports = {
  getBowlingPhaseStats,
};
const Delivery = require("../../models/Delivery");

const getPhase = (over) => {
  if (over <= 5) return "powerplay";
  if (over <= 14) return "middle";
  return "death";
};

const getMatchupPhaseStats = async (batterId, bowlerId) => {
  const deliveries = await Delivery.find({
    batter: batterId,
    bowler: bowlerId,
  });

  const phases = {
    powerplay: {
      balls: 0,
      runs: 0,
      fours: 0,
      sixes: 0,
      dotBalls: 0,
      dismissals: 0,
    },

    middle: {
      balls: 0,
      runs: 0,
      fours: 0,
      sixes: 0,
      dotBalls: 0,
      dismissals: 0,
    },

    death: {
      balls: 0,
      runs: 0,
      fours: 0,
      sixes: 0,
      dotBalls: 0,
      dismissals: 0,
    },
  };

  for (const delivery of deliveries) {
    const phase = getPhase(delivery.over);
    const stats = phases[phase];

    const extrasType = delivery.extrasType || [];

    const isWide = extrasType.includes("wides");
    const isNoBall = extrasType.includes("noballs");

    // Batter faced a legal ball
    if (!isWide) {
      stats.balls++;
    }

    // Runs scored by batter
    stats.runs += delivery.batterRuns;

    // Boundaries
    if (delivery.batterRuns === 4) {
      stats.fours++;
    }

    if (delivery.batterRuns === 6) {
      stats.sixes++;
    }

    // Dot ball
    if (
      delivery.batterRuns === 0 &&
      !isWide &&
      !isNoBall
    ) {
      stats.dotBalls++;
    }

    // Batter dismissal
    if (
      delivery.wicket &&
      delivery.playerOut === batterId
    ) {
      const nonBowlerWickets = [
        "retired hurt",
        "retired out",
        "obstructing the field",
      ];

      if (!nonBowlerWickets.includes(delivery.wicketType)) {
        stats.dismissals++;
      }
    }
  }

  // Calculate strike rate
  for (const phase in phases) {
    const stats = phases[phase];

    stats.strikeRate =
      stats.balls > 0
        ? Number(((stats.runs / stats.balls) * 100).toFixed(2))
        : 0;
  }

  return phases;
};

module.exports = {
  getMatchupPhaseStats,
};
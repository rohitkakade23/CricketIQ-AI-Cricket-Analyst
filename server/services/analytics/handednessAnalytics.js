const Delivery = require("../../models/Delivery");
const Player = require("../../models/Player");

const getBowlerVsHandStats = async (bowlerId) => {
  const deliveries = await Delivery.find({
    bowler: bowlerId,
  }).populate("batter");

  const stats = {
    right: {
      balls: 0,
      runsConceded: 0,
      wickets: 0,
      dotBalls: 0,
    },

    left: {
      balls: 0,
      runsConceded: 0,
      wickets: 0,
      dotBalls: 0,
    },
  };

  for (const delivery of deliveries) {
    const batter = delivery.batter;

    if (!batter || !batter.battingHand) {
      continue;
    }

    const hand = batter.battingHand;

    const handStats = stats[hand];

    const extrasType = delivery.extrasType || [];

    const isWide = extrasType.includes("wides");
    const isNoBall = extrasType.includes("noballs");

    // Legal ball
    if (!isWide && !isNoBall) {
      handStats.balls++;
    }

    // Runs conceded by bowler
    let concededRuns = delivery.runs;

    const isBye = extrasType.includes("byes");
    const isLegBye = extrasType.includes("legbyes");

    if (isBye || isLegBye) {
      concededRuns -= delivery.extras;
    }

    handStats.runsConceded += concededRuns;

    // Dot ball
    if (
      delivery.runs === 0 &&
      !isWide &&
      !isNoBall
    ) {
      handStats.dotBalls++;
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
        handStats.wickets++;
      }
    }
  }

  // Calculate economy and dot-ball percentage
  for (const hand in stats) {
    const data = stats[hand];

    data.economy =
      data.balls > 0
        ? Number(
            (
              data.runsConceded /
              (data.balls / 6)
            ).toFixed(2)
          )
        : 0;

    data.dotBallPercentage =
      data.balls > 0
        ? Number(
            ((data.dotBalls / data.balls) * 100).toFixed(2)
          )
        : 0;
  }

  return stats;
};

module.exports = {
  getBowlerVsHandStats,
};
const Delivery = require("../../models/Delivery");

const getBattingStats = async (playerId) => {
  const deliveries = await Delivery.find({
    batter: playerId,
  });

  let runs = 0;
  let balls = 0;
  let fours = 0;
  let sixes = 0;
  let dismissals = 0;

  for (const delivery of deliveries) {
    runs += delivery.batterRuns;

    /*
      A legal delivery counts as a ball.

      Wides don't count as balls.
    */

    const isWide =
      delivery.extrasType.includes("wides");

    if (!isWide) {
      balls++;
    }

    if (delivery.batterRuns === 4) {
      fours++;
    }

    if (delivery.batterRuns === 6) {
      sixes++;
    }
  }

  for (const delivery of deliveries) {
  if (
    delivery.wicket &&
    delivery.playerOut?.toString() ===
      playerId.toString()
  ) {
    dismissals++;
  }
}

const average =
  dismissals > 0
    ? runs / dismissals
    : runs;

  const strikeRate =
    balls > 0
      ? (runs / balls) * 100
      : 0;

  return {
    runs,
    balls,
    fours,
    sixes,
    dismissals,
    average: Number(average.toFixed(2)),
    strikeRate: Number(strikeRate.toFixed(2)),
  };
};

module.exports = {
  getBattingStats,
};
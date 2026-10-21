const Delivery = require("../../models/Delivery");

const getBatterBowlerMatchup = async (batterId, bowlerId) => {
  const deliveries = await Delivery.find({
    batter: batterId,
    bowler: bowlerId,
  });

  let balls = 0;
  let runs = 0;
  let fours = 0;
  let sixes = 0;
  let dotBalls = 0;
  let dismissals = 0;

  for (const delivery of deliveries) {
    const extrasType = delivery.extrasType || [];

    const isWide = extrasType.includes("wides");
    const isNoBall = extrasType.includes("noballs");

    // Ball faced
    if (!isWide) {
      balls++;
    }

    // Runs scored by batter
    runs += delivery.batterRuns;

    // Boundaries
    if (delivery.batterRuns === 4) {
      fours++;
    }

    if (delivery.batterRuns === 6) {
      sixes++;
    }

    // Dot ball
    if (
      delivery.batterRuns === 0 &&
      !isWide &&
      !isNoBall
    ) {
      dotBalls++;
    }

    // Batter dismissed by this bowler
    if (
      delivery.wicket &&
      delivery.playerOut === batterId
    ) {
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
        dismissals++;
      }
    }
  }

  const strikeRate =
    balls > 0
      ? (runs / balls) * 100
      : 0;

  return {
    balls,
    runs,
    fours,
    sixes,
    dotBalls,
    dismissals,
    strikeRate: Number(strikeRate.toFixed(2)),
  };
};

module.exports = {
  getBatterBowlerMatchup,
};
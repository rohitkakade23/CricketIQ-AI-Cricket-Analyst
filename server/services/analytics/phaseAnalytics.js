const getPhase = (over) => {
  if (over <= 5) {
    return "powerplay";
  }

  if (over <= 14) {
    return "middle";
  }

  return "death";
};

const Delivery = require("../../models/Delivery");

const getPhaseWiseBatting = async (playerId) => {
  const deliveries = await Delivery.find({
    batter: playerId,
  });

  const phases = {
    powerplay: {
      runs: 0,
      balls: 0,
    },

    middle: {
      runs: 0,
      balls: 0,
    },

    death: {
      runs: 0,
      balls: 0,
    },
  };

  for (const delivery of deliveries) {
    const phase = getPhase(
      delivery.over
    );

    phases[phase].runs +=
      delivery.batterRuns;

    const isWide =
      delivery.extrasType.includes("wides");

    if (!isWide) {
      phases[phase].balls++;
    }
  }

  for (const phase of Object.keys(phases)) {
    const data = phases[phase];

    data.strikeRate =
      data.balls > 0
        ? Number(
            (
              (data.runs /
                data.balls) *
              100
            ).toFixed(2)
          )
        : 0;
  }

  return phases;
};

module.exports = {
  getPhaseWiseBatting,
};
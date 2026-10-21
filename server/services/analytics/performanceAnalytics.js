const mongoose = require("mongoose");

const Delivery = require("../../models/Delivery");
const Match = require("../../models/Match");

const getPlayerPerformance = async (
  playerId,
  competition,
  season
) => {
  // -----------------------------
  // Validate player ID
  // -----------------------------

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    throw new Error("Invalid player ID");
  }

  const playerObjectId =
    new mongoose.Types.ObjectId(playerId);

  // -----------------------------
  // Match filter
  // -----------------------------

  const matchFilter = {};

  if (competition) {
    matchFilter.competition = competition;
  }

  if (season) {
    matchFilter.season = season;
  }

  // =====================================================
  // BATTING
  // =====================================================

  const battingData = await Delivery.aggregate([
    {
      $match: {
        batter: playerObjectId,
      },
    },

    // Get match information
    {
      $lookup: {
        from: "matches",
        localField: "match",
        foreignField: "_id",
        as: "matchInfo",
      },
    },

    {
      $unwind: "$matchInfo",
    },

    // Apply competition / season filter
    {
      $match: {
        ...(competition && {
          "matchInfo.competition": competition,
        }),

        ...(season && {
          "matchInfo.season": season,
        }),
      },
    },

    // Group all batting deliveries
    {
      $group: {
        _id: null,

        runs: {
          $sum: "$batterRuns",
        },

        balls: {
          $sum: {
            $cond: [
              {
                $not: {
                  $in: [
                    "wides",
                    "$extrasType",
                  ],
                },
              },
              1,
              0,
            ],
          },
        },

        fours: {
          $sum: {
            $cond: [
              {
                $eq: ["$batterRuns", 4],
              },
              1,
              0,
            ],
          },
        },

        sixes: {
          $sum: {
            $cond: [
              {
                $eq: ["$batterRuns", 6],
              },
              1,
              0,
            ],
          },
        },

        dismissals: {
          $sum: {
            $cond: [
              {
                $and: [
                  "$wicket",
                  {
                    $eq: [
                      "$playerOut",
                      playerObjectId,
                    ],
                  },
                  {
                    $not: {
                      $in: [
                        "$wicketType",
                        [
                          "retired hurt",
                          "retired out",
                          "obstructing the field",
                        ],
                      ],
                    },
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        innings: {
          $addToSet: "$innings",
        },

        matches: {
          $addToSet: "$match",
        },
      },
    },
  ]);

  // =====================================================
  // BOWLING
  // =====================================================

  const bowlingData = await Delivery.aggregate([
    {
      $match: {
        bowler: playerObjectId,
      },
    },

    {
      $lookup: {
        from: "matches",
        localField: "match",
        foreignField: "_id",
        as: "matchInfo",
      },
    },

    {
      $unwind: "$matchInfo",
    },

    {
      $match: {
        ...(competition && {
          "matchInfo.competition": competition,
        }),

        ...(season && {
          "matchInfo.season": season,
        }),
      },
    },

    {
      $group: {
        _id: null,

        runsConceded: {
          $sum: {
            $cond: [
              {
                $not: {
                  $in: [
                    "byes",
                    "$extrasType",
                  ],
                },
              },
              {
                $cond: [
                  {
                    $in: [
                      "legbyes",
                      "$extrasType",
                    ],
                  },
                  {
                    $subtract: [
                      "$runs",
                      "$extras",
                    ],
                  },
                  "$runs",
                ],
              },
              0,
            ],
          },
        },

        legalBalls: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $not: {
                      $in: [
                        "wides",
                        "$extrasType",
                      ],
                    },
                  },
                  {
                    $not: {
                      $in: [
                        "noballs",
                        "$extrasType",
                      ],
                    },
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        wickets: {
         $sum: {
          $cond: [
         {
        $and: [
          "$wicket",

            {
              $not: {
              $in: [
                "$wicketType",
                [
                  "run out",
                  "retired hurt",
                  "retired out",
                  "obstructing the field",
                ],
               ],
               },
           },
        ],
      },
      1,
      0,
    ],
  },
 },

        bowlingInnings: {
          $addToSet: "$innings",
        },

        bowlingMatches: {
          $addToSet: "$match",
        },
      },
    },
  ]);

  // -----------------------------
  // Prepare batting stats
  // -----------------------------

  const batting = battingData[0] || {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    dismissals: 0,
    innings: [],
    matches: [],
  };

  const battingAverage =
    batting.dismissals > 0
      ? batting.runs / batting.dismissals
      : batting.runs;

  const strikeRate =
    batting.balls > 0
      ? (batting.runs / batting.balls) * 100
      : 0;

  // -----------------------------
  // Prepare bowling stats
  // -----------------------------

  const bowling = bowlingData[0] || {
    runsConceded: 0,
    legalBalls: 0,
    wickets: 0,
    bowlingInnings: [],
    bowlingMatches: [],
  };

  const economy =
    bowling.legalBalls > 0
      ? (bowling.runsConceded /
          bowling.legalBalls) *
        6
      : 0;

  const overs = Math.floor(
    bowling.legalBalls / 6
  );

  const balls = bowling.legalBalls % 6;

  // -----------------------------
  // Final response
  // -----------------------------

  return {
    filters: {
      competition: competition || "All",
      season: season || "All",
    },

    batting: {
      matches: batting.matches.length,

      innings: batting.innings.length,

      runs: batting.runs,

      balls: batting.balls,

      average: Number(
        battingAverage.toFixed(2)
      ),

      strikeRate: Number(
        strikeRate.toFixed(2)
      ),

      fours: batting.fours,

      sixes: batting.sixes,

      dismissals: batting.dismissals,
    },

    bowling: {
      matches:
        bowling.bowlingMatches.length,

      innings:
        bowling.bowlingInnings.length,

      overs: `${overs}.${balls}`,

      legalBalls: bowling.legalBalls,

      runsConceded:
        bowling.runsConceded,

      wickets: bowling.wickets,

      economy: Number(
        economy.toFixed(2)
      ),
    },
  };
};

const getTopPerformers = async () => {
  const topPerformers = await Delivery.aggregate([
    {
      $group: {
        _id: "$batter",
        runs: {
          $sum: "$batterRuns",
        },
        balls: {
          $sum: {
            $cond: [
              {
                $not: {
                  $in: ["wides", "$extrasType"],
                },
              },
              1,
              0,
            ],
          },
        },
        fours: {
          $sum: {
            $cond: [
              {
                $eq: ["$batterRuns", 4],
              },
              1,
              0,
            ],
          },
        },
        sixes: {
          $sum: {
            $cond: [
              {
                $eq: ["$batterRuns", 6],
              },
              1,
              0,
            ],
          },
        },
      },
    },

    {
      $sort: {
        runs: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $lookup: {
        from: "players",
        localField: "_id",
        foreignField: "_id",
        as: "player",
      },
    },

    {
      $unwind: "$player",
    },

    {
      $project: {
        _id: 0,
        playerId: "$player._id",
        name: "$player.name",
        runs: 1,
        balls: 1,
        fours: 1,
        sixes: 1,
      },
    },
  ]);

  return topPerformers;
};

const getTopBowlers = async () => {
  const topBowlers = await Delivery.aggregate([
    {
      $match: {
        bowler: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$bowler",

        runsConceded: {
          $sum: {
            $cond: [
              {
                $not: {
                  $in: ["byes", "$extrasType"],
                },
              },
              {
                $cond: [
                  {
                    $in: ["legbyes", "$extrasType"],
                  },
                  {
                    $subtract: ["$runs", "$extras"],
                  },
                  "$runs",
                ],
              },
              0,
            ],
          },
        },

        legalBalls: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $not: {
                      $in: ["wides", "$extrasType"],
                    },
                  },
                  {
                    $not: {
                      $in: ["noballs", "$extrasType"],
                    },
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        wickets: {
          $sum: {
            $cond: [
              {
                $and: [
                  "$wicket",
                  {
                    $not: {
                      $in: [
                        "$wicketType",
                        [
                          "run out",
                          "retired hurt",
                          "retired out",
                          "obstructing the field",
                        ],
                      ],
                    },
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: {
        wickets: -1,
        runsConceded: 1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "players",
        localField: "_id",
        foreignField: "_id",
        as: "player",
      },
    },
    {
      $unwind: "$player",
    },
    {
      $project: {
        _id: 0,
        playerId: "$player._id",
        name: "$player.name",
        wickets: 1,
        runsConceded: 1,
        legalBalls: 1,
        overs: {
          $concat: [
            {
              $toString: {
                $floor: {
                  $divide: ["$legalBalls", 6],
                },
              },
            },
            ".",
            {
              $toString: {
                $mod: ["$legalBalls", 6],
              },
            },
          ],
        },
        economy: {
          $cond: [
            { $gt: ["$legalBalls", 0] },
            {
              $round: [
                {
                  $divide: [
                    { $multiply: ["$runsConceded", 6] },
                    "$legalBalls",
                  ],
                },
                2,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);

  return topBowlers;
};

module.exports = {
  getPlayerPerformance,
  getTopPerformers,
  getTopBowlers,
};
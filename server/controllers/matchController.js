const Match = require("../models/Match");
const Delivery = require("../models/Delivery");
const Innings = require("../models/Innings");
const {
  generateAIResponse,
} = require("../services/ai/aiService");

const {
  buildMatchPrompt,
} = require("../services/ai/matchPrompt");

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("teams")
      .populate("winner")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("teams")
      .populate("winner");

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAIMatchSummary = async (req, res) => {
  try {
    const { id } = req.params;

    // Get match information
    const match = await Match.findById(id)
      .populate("teams")
      .populate("winner");

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // Get all deliveries for this match
    const deliveries = await Delivery.find({
      match: id,
    })
      .populate("batter")
      .populate("bowler")
      .populate("playerOut")

    if (!deliveries.length) {
      return res.status(404).json({
        success: false,
        message: "No delivery data found for this match",
      });
    }

    // -----------------------------
    // BATTING PERFORMANCE
    // -----------------------------

    const battingMap = {};

    deliveries.forEach((delivery) => {
      if (!delivery.batter) return;

      const playerId = delivery.batter._id.toString();

      if (!battingMap[playerId]) {
        battingMap[playerId] = {
          player: delivery.batter.name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
        };
      }

      battingMap[playerId].runs += delivery.batterRuns || 0;

      // Legal ball faced
      if (
        !delivery.extrasType ||
        !delivery.extrasType.includes("wides")
      ) {
        battingMap[playerId].balls += 1;
      }

      if (delivery.batterRuns === 4) {
        battingMap[playerId].fours += 1;
      }

      if (delivery.batterRuns === 6) {
        battingMap[playerId].sixes += 1;
      }
    });

    const battingScorecards = Object.values(battingMap).map(
      (player) => ({
        ...player,
        strikeRate:
          player.balls > 0
            ? Number(
                ((player.runs / player.balls) * 100).toFixed(2)
              )
            : 0,
      })
    );


    // -----------------------------
    // BOWLING PERFORMANCE
    // -----------------------------

    const bowlingMap = {};

    deliveries.forEach((delivery) => {
    //   if (!delivery.bowler) return;

    //   const playerId = delivery.bowler._id.toString();

    //   if (!bowlingMap[playerId]) {
    //     bowlingMap[playerId] = {
    //       player: delivery.bowler.name,
    //       balls: 0,
    //       runsConceded: 0,
    //       wickets: 0,
    //     };
    //   }

    //   // Legal delivery
    //   if (
    //     !delivery.extrasType ||
    //     !delivery.extrasType.includes("wides") &&
    //     !delivery.extrasType.includes("noballs")
    //   ) {
    //     bowlingMap[playerId].balls += 1;
    //   }

    //   // Runs conceded by bowler
    //   let runsConceded = delivery.runs || 0;

    //   if (
    //     delivery.extrasType &&
    //     delivery.extrasType.includes("byes")
    //   ) {
    //     runsConceded -= delivery.extras || 0;
    //   }

    //   if (
    //     delivery.extrasType &&
    //     delivery.extrasType.includes("legbyes")
    //   ) {
    //     runsConceded -= delivery.extras || 0;
    //   }

    //   bowlingMap[playerId].runsConceded += Math.max(
    //     runsConceded,
    //     0
    //   );

    //   // Count wickets
    //   if (
    //     delivery.wicket &&
    //     delivery.playerOut
    //   ) {
    //     const wicketType = delivery.wicketType;

    //     // Don't count run outs etc. as bowler wickets
    //     const nonBowlerWickets = [
    //       "run out",
    //       "retired hurt",
    //       "retired out",
    //       "obstructing the field",
    //     ];

    //     if (!nonBowlerWickets.includes(wicketType)) {
    //       bowlingMap[playerId].wickets += 1;
    //     }
    //   }
    // });


      // -----------------------------
      // BOWLING
      // -----------------------------

     
      // -----------------------------
      // BOWLING
      // -----------------------------

      if (delivery.bowler && delivery.innings) {
        const playerId = delivery.bowler._id.toString();
        const inningsId = delivery.innings._id.toString();
        const key = `${inningsId}_${playerId}`;

        if (!bowlingMap[key]) {
          bowlingMap[key] = {
            player: delivery.bowler.name,
            playerId,
            inningsId,
            balls: 0,
            runsConceded: 0,
            wickets: 0,
          };
        }

        const extrasTypes = (delivery.extrasType || [])
          .map((type) => type.toLowerCase());

        const isWide = extrasTypes.some((type) => type.includes("wide"));
        const isNoBall = extrasTypes.some((type) => type.includes("noball"));
        const isBye = extrasTypes.some((type) => type.includes("bye"));
        const isLegBye = extrasTypes.some((type) => type.includes("legbye"));

        // Count legal deliveries
        if (!isWide && !isNoBall) {
          bowlingMap[key].balls += 1;
        }

        // Runs charged to the bowler:
        // batter runs + wides + no-ball extras.
        // Byes and leg-byes are not charged to the bowler.
        let concededRuns = Number(delivery.batterRuns || 0);

        if (isWide || isNoBall) {
          concededRuns += Number(delivery.extras || 0);
        }

        // If the dataset stores wides and no-balls together with
        // other extras, subtract byes/leg-byes from the total extras.
        if (isBye || isLegBye) {
          concededRuns = Number(delivery.batterRuns || 0);

          if (isWide || isNoBall) {
            concededRuns += Number(delivery.extras || 0);
          }
        }

        bowlingMap[key].runsConceded += concededRuns;

        // Count wickets credited to the bowler
        if (delivery.wicket && delivery.playerOut) {
          const wicketType = (delivery.wicketType || "").toLowerCase();

          const nonBowlerWickets = [
            "run out",
            "retired hurt",
            "retired out",
            "obstructing the field",
          ];

          if (!nonBowlerWickets.includes(wicketType)) {
            bowlingMap[key].wickets += 1;
          }
        }
      }

    })


    const bowlingScorecards = Object.values(bowlingMap).map((player) => ({
  ...player,
  overs: `${Math.floor(player.balls / 6)}.${player.balls % 6}`,
  economy:
    player.balls > 0
      ? Number(((player.runsConceded * 6) / player.balls).toFixed(2))
      : 0,
}));

    

    // const bowlingScorecards = Object.values(bowlingMap).map(
    //   (player) => ({
    //     ...player,
    //     overs: Number(
    //       (player.balls / 6).toFixed(1)
    //     ),
    //     economy:
    //       player.balls > 0
    //         ? Number(
    //             (
    //               (player.runsConceded / player.balls) *
    //               6
    //             ).toFixed(2)
    //           )
    //         : 0,
    //   })
    // );


    // -----------------------------
    // KEY PERFORMERS
    // -----------------------------

    const topBatters = [...battingScorecards]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);

    const topBowlers = [...bowlingScorecards]
      .sort((a, b) => b.wickets - a.wickets)
      .slice(0, 3);

    const keyPerformers = [
      ...topBatters.map((player) => ({
        player: player.player,
        contribution: `${player.runs} runs from ${player.balls} balls`,
      })),

      ...topBowlers.map((player) => ({
        player: player.player,
        contribution: `${player.wickets} wickets for ${player.runsConceded} runs`,
      })),
    ];


    // -----------------------------
    // BUILD AI PROMPT
    // -----------------------------

    const prompt = buildMatchPrompt({
      match: {
        id: match._id,
        competition: match.competition,
        season: match.season,
        teams: match.teams.map((team) => team.name),
        format: match.format,
        date: match.date,
        venue: match.venue,
        winner: match.winner
          ? match.winner.name
          : null,
        result: match.result,
      },

      battingScorecards,

      bowlingScorecards,

      keyPerformers,
    });


    // -----------------------------
    // GEMINI
    // -----------------------------

    const aiResponse = await generateAIResponse(prompt);

    let insights;

    try {
      let cleanedResponse = aiResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const start = cleanedResponse.indexOf("{");
      const end = cleanedResponse.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error(
          "No JSON object found in Gemini response"
        );
      }

      cleanedResponse = cleanedResponse.substring(
        start,
        end + 1
      );

      insights = JSON.parse(cleanedResponse);

    } catch (error) {
      console.error(
        "Failed to parse Gemini match JSON:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }


    // -----------------------------
    // FINAL RESPONSE
    // -----------------------------

    return res.status(200).json({
      success: true,

      match: {
        id: match._id,
        competition: match.competition,
        season: match.season,
        teams: match.teams,
        winner: match.winner,
        result: match.result,
      },

      battingScorecards,

      bowlingScorecards,

      keyPerformers,

      aiInsights: insights,
    });

  } catch (error) {
    console.error(
      "AI Match Summary Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI match summary",
      error: error.message,
    });
  }
};

const getMatchAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

//     const match = await Match.findById(id);

// console.log("Requested ID:", id);
// console.log("Match found:", Boolean(match));

// if (match) {
//   console.log("External ID:", match.externalMatchId);
//   console.log(
//     "Linked deliveries:",
//     await Delivery.countDocuments({ match: match._id })
//   );
// }

    const deliveries = await Delivery.find({
      match: id,
    })
      .populate("batter")
      .populate("bowler")
      .populate("playerOut")
      .populate({
       path: "innings",
       populate: {
      path: "team",
      },
     });

//      console.log(
//   "SAMPLE DELIVERY:",
//   JSON.stringify(
//     deliveries.slice(0, 5).map((d) => ({
//       runs: d.runs,
//       batterRuns: d.batterRuns,
//       extras: d.extras,
//       extrasType: d.extrasType,
//       wicket: d.wicket,
//       wicketType: d.wicketType,
//       bowler: d.bowler?.name,
//     })),
//     null,
//     2
//   )
// );

//      if (deliveries.length > 0) {
//   const d = deliveries[0];

//   console.log("DELIVERY DEBUG:", {
//     batterRuns: d.batterRuns,
//     totalRuns: d.totalRuns,
//     runs: d.runs,
//     extras: d.extras,
//     extrasType: d.extrasType,
//     isWide: d.isWide,
//     isNoBall: d.isNoBall,
//     isBye: d.isBye,
//     isLegBye: d.isLegBye,
//     ballsFaced: d.bowler?.name,
//   });
// }

    //   console.log("Analytics match ID:", id);
    //  console.log("Deliveries found:", deliveries.length);

    if (!deliveries.length) {
      return res.status(404).json({
        success: false,
        message: "No delivery data found for this match",
      });
    }

    const battingMap = {};
    const bowlingMap = {};
    const inningsMap = {};

    deliveries.forEach((delivery) => {
      const inningsId = delivery.innings?._id?.toString();
      const inningsNumber = delivery.innings?.inningsNumber;

        if (!inningsId) return;

        if (!inningsMap[inningsId]) {
        inningsMap[inningsId] = {
        inningsId,
        inningsNumber,
        team: delivery.innings?.team?.name || "Unknown Team",
        battingScorecards: {},
        bowlingScorecards: {},
      };
      }
    

      // -----------------------------
      // BATTING
      // -----------------------------

      if (delivery.batter) {
  const playerId = delivery.batter._id.toString();
  const inningsId = delivery.innings._id.toString();
  const key = `${inningsId}_${playerId}`;

  if (!battingMap[key]) {
    battingMap[key] = {
      player: delivery.batter.name,
      playerId,
      inningsId,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      team: delivery.battingTeam,
    };
  }

  battingMap[key].runs += delivery.batterRuns || 0;

  if (!delivery.isWide && !delivery.isBye && !delivery.isLegBye) {
    battingMap[key].balls += 1;
  }

  if (delivery.batterRuns === 4) {
    battingMap[key].fours += 1;
  }

  if (delivery.batterRuns === 6) {
    battingMap[key].sixes += 1;
  }
}

      // -----------------------------
      // BOWLING
      // -----------------------------

      if (delivery.bowler) {
  const playerId = delivery.bowler._id.toString();
  const inningsId = delivery.innings._id.toString();
  const key = `${inningsId}_${playerId}`;

  if (!bowlingMap[key]) {
    bowlingMap[key] = {
      player: delivery.bowler.name,
      playerId,
      inningsId,
      balls: 0,
      runsConceded: 0,
      wickets: 0,
    };
  }

  if (!delivery.isWide && !delivery.isNoBall) {
    bowlingMap[key].balls += 1;
  }

  const extrasType = delivery.extrasType || [];
  const isBye = extrasType.includes("byes");
  const isLegBye = extrasType.includes("legbyes");
  let concededRuns = delivery.runs || 0;

  if (isBye || isLegBye) {
    concededRuns -= delivery.extras || 0;
  }

  bowlingMap[key].runsConceded += Math.max(concededRuns, 0);

  if (
    delivery.playerOut &&
    delivery.wicketType !== "run out" &&
    delivery.wicketType !== "retired hurt"
  ) {
    bowlingMap[key].wickets += 1;
  }
}
  });

   const battingScorecards = Object.values(battingMap).map((player) => ({
  ...player,
  strikeRate:
    player.balls > 0
      ? ((player.runs / player.balls) * 100).toFixed(2)
      : "0.00",
}));

const bowlingScorecards = Object.values(bowlingMap).map((player) => ({
  ...player,
  overs: `${Math.floor(player.balls / 6)}.${player.balls % 6}`,
  economy:
    player.balls > 0
      ? ((player.runsConceded / player.balls) * 6).toFixed(2)
      : "0.00",
}));


const inningsScorecards = Object.values(inningsMap)
  .sort((a, b) => a.inningsNumber - b.inningsNumber)
  .map((innings) => ({
    inningsId: innings.inningsId,
    inningsNumber: innings.inningsNumber,
    team: innings.team,
    battingScorecards: battingScorecards.filter(
      (player) => player.inningsId === innings.inningsId
    ),
    bowlingScorecards: bowlingScorecards.filter(
      (player) => player.inningsId === innings.inningsId
    ),
  }));

    return res.status(200).json({
      success: true,
      inningsScorecards,
      battingScorecards,
      bowlingScorecards,
    });
  } catch (error) {
    console.error("Match Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch match analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getMatches,
  getMatchById,
  getAIMatchSummary,
  getMatchAnalytics,
};
  
  

module.exports = {
  getMatches,
  getMatchById,
  getAIMatchSummary,
  getMatchAnalytics,
};
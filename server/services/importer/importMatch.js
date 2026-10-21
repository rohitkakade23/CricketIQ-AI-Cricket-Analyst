const fs = require("fs");
const path = require("path");

const Player = require("../../models/Player");
const Team = require("../../models/Team");
const Match = require("../../models/Match");
const Innings = require("../../models/Innings");
const Delivery = require("../../models/Delivery");

const importMatch = async (filePath) => {
  const file = fs.readFileSync(
    path.resolve(filePath),
    "utf-8"
  );

  const data = JSON.parse(file);

  console.log("Importing match...");
  console.log("Teams:", data.info.teams);

  // --------------------------------
  // 1. CREATE / FIND TEAMS
  // --------------------------------

  const teamDocuments = [];

  for (const teamName of data.info.teams) {
    const team = await Team.findOneAndUpdate(
      { name: teamName },
      {
        name: teamName,
        country: teamName,
      },
      {
        new: true,
        upsert: true,
      }
    );

    teamDocuments.push(team);
  }

  // --------------------------------
  // 2. CREATE / FIND PLAYERS
  // --------------------------------

  const playersMap = new Map();

  for (const teamName of data.info.teams) {
    const players = data.info.players[teamName] || [];

    for (const playerName of players) {
      const registryId =
        data.info.registry?.people?.[playerName];

      const player = await Player.findOneAndUpdate(
        {
          name: playerName,
        },
        {
          name: playerName,
          country: teamName,
        },
        {
          new: true,
          upsert: true,
        }
      );

      playersMap.set(playerName, player);
    }
  }

  console.log(
    `Players imported: ${playersMap.size}`
  );

  // --------------------------------
  // 3. CREATE MATCH
  // --------------------------------

  const matchId = path.basename(
    filePath,
    ".json"
  );

  const existingMatch = await Match.findOne({
    externalMatchId: matchId,
  });

  if (existingMatch) {
    console.log("Match already imported.");
    return;
  }

  const winnerTeam = teamDocuments.find(
    (team) => team.name === data.info.outcome?.winner
  );

  const match = await Match.create({
    externalMatchId: matchId,

    competition: data.info.event?.name || "Unknown",

    season: String(data.info.season),

    teams: teamDocuments.map((team) => team._id),

    format: data.info.match_type,

    date: data.info.dates?.[0],

    venue: data.info.venue?.name || data.info.city,

    winner: winnerTeam?._id,

    result: data.info.outcome
      ? JSON.stringify(data.info.outcome)
      : "",
  });

  console.log("Match created:", match._id);

  // --------------------------------
  // 4. IMPORT INNINGS
  // --------------------------------

  for (
    let inningsIndex = 0;
    inningsIndex < data.innings.length;
    inningsIndex++
  ) {
    const inningsData = data.innings[inningsIndex];

    const battingTeam = teamDocuments.find(
      (team) => team.name === inningsData.team
    );

    if (!battingTeam) {
      console.log(
        "Team not found:",
        inningsData.team
      );

      continue;
    }

    const innings = await Innings.create({
      match: match._id,
      team: battingTeam._id,
      inningsNumber: inningsIndex + 1,
    });

    // --------------------------------
    // 5. IMPORT OVERS
    // --------------------------------

    for (const overData of inningsData.overs) {
      for (const ballData of overData.deliveries) {
        const batter =
          playersMap.get(ballData.batter);

        const bowler =
          playersMap.get(ballData.bowler);

        const nonStriker =
          playersMap.get(ballData.non_striker);

        const wicketData =
          ballData.wickets?.[0];

        const playerOut =
          wicketData
            ? playersMap.get(
                wicketData.player_out
              )
            : null;

        await Delivery.create({
          match: match._id,

          innings: innings._id,

          over: overData.over,

          ball: parseFloat(
            ballData.actual_delivery
          ) || 0,

          actualDelivery:
            ballData.actual_delivery,

          batter: batter?._id,

          bowler: bowler?._id,

          nonStriker: nonStriker?._id,

          battingTeam: battingTeam._id,

          runs: ballData.runs?.total || 0,

          batterRuns:
            ballData.runs?.batter || 0,

          extras:
            ballData.runs?.extras || 0,

          extrasType: ballData.extras
            ? Object.keys(ballData.extras)
            : [],

          wicket: Boolean(wicketData),

          wicketType:
            wicketData?.kind || "",

          playerOut: playerOut?._id,
        });
      }
    }

    console.log(
      `Innings ${inningsIndex + 1} imported`
    );
  }

  console.log("✅ Match import completed!");
};

module.exports = importMatch;
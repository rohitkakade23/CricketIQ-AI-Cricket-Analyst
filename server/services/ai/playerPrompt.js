const buildPlayerPrompt = (player, performance) => {
  return `
You are an expert cricket analyst.

Analyze the following player's performance statistics.

PLAYER:
Name: ${player.name}

BATTING:
Matches: ${performance.batting.matches}
Innings: ${performance.batting.innings}
Runs: ${performance.batting.runs}
Average: ${performance.batting.average}
Strike Rate: ${performance.batting.strikeRate}
Fours: ${performance.batting.fours}
Sixes: ${performance.batting.sixes}
Dismissals: ${performance.batting.dismissals}

BOWLING:
Matches: ${performance.bowling.matches}
Innings: ${performance.bowling.innings}
Overs: ${performance.bowling.overs}
Runs Conceded: ${performance.bowling.runsConceded}
Wickets: ${performance.bowling.wickets}
Economy: ${performance.bowling.economy}

Give a concise cricket analysis containing:

1. Overall assessment
2. Batting strengths
3. Batting weaknesses
4. Bowling assessment
5. Tactical recommendation

Do not invent statistics that are not provided.
Base your analysis only on the information given above.
`;
};

module.exports = {
  buildPlayerPrompt,
};
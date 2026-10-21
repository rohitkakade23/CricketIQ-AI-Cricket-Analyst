const buildPlayerInsightsPrompt = (
  player,
  performance,
  phaseAnalysis,
  bowlingPhaseAnalysis
) => {
  return `
You are an expert cricket analyst working for CricketIQ.

Analyze the following player's performance using ONLY the statistics provided below.

PLAYER
Name: ${player.name}

OVERALL BATTING
Matches: ${performance.batting.matches}
Innings: ${performance.batting.innings}
Runs: ${performance.batting.runs}
Average: ${performance.batting.average}
Strike Rate: ${performance.batting.strikeRate}
Fours: ${performance.batting.fours}
Sixes: ${performance.batting.sixes}
Dismissals: ${performance.batting.dismissals}

OVERALL BOWLING
Matches: ${performance.bowling.matches}
Innings: ${performance.bowling.innings}
Overs: ${performance.bowling.overs}
Runs Conceded: ${performance.bowling.runsConceded}
Wickets: ${performance.bowling.wickets}
Economy: ${performance.bowling.economy}

BATTING PHASE ANALYSIS
${JSON.stringify(phaseAnalysis, null, 2)}

BOWLING PHASE ANALYSIS
${JSON.stringify(bowlingPhaseAnalysis, null, 2)}

TASK

Identify:

1. Overall summary
2. Top 3 strengths
3. Top 3 weaknesses
4. Tactical recommendation

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "string",
  "strengths": [
    "string",
    "string",
    "string"
  ],
  "weaknesses": [
    "string",
    "string",
    "string"
  ],
  "tacticalRecommendation": "string"
}

IMPORTANT RULES:

- Return ONLY JSON.
- Do not use markdown.
- Do not wrap the JSON in triple backticks.
- Use ONLY the statistics provided.
- Do not invent statistics.
- Do not make claims that cannot reasonably be supported by the data.
- If there is insufficient data for a conclusion, clearly mention that.
- Keep the analysis concise and cricket-specific.
`;
};

module.exports = {
  buildPlayerInsightsPrompt,
};
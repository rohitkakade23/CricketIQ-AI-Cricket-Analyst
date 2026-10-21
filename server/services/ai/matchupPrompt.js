const buildMatchupPrompt = ({
  batter,
  bowler,
  matchup,
  phaseAnalysis,
}) => {
  return `
You are an expert cricket analyst for an application called CricketIQ.

Analyze the following REAL statistical data for a batter vs bowler matchup.

IMPORTANT RULES:
- Use ONLY the statistics provided below.
- Do NOT invent statistics.
- Do NOT assume statistics that are not provided.
- If the sample size is small, mention that the conclusion has limited confidence.
- Give practical cricket strategy based on the available data.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap the response in \`\`\`json.

BATTER:
${JSON.stringify(batter, null, 2)}

BOWLER:
${JSON.stringify(bowler, null, 2)}

OVERALL MATCHUP:
${JSON.stringify(matchup, null, 2)}

PHASE ANALYSIS:
${JSON.stringify(phaseAnalysis, null, 2)}

Return the answer in exactly this JSON structure:

{
  "summary": "Short summary of the matchup.",
  "batterAdvantage": "Explain whether the available data favors the batter, bowler, or is balanced.",
  "bowlingStrategy": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "battingStrategy": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "keyInsight": "Most important tactical insight from the data.",
  "confidence": "Low, Medium, or High"
}
`;
};

module.exports = {
  buildMatchupPrompt,
};
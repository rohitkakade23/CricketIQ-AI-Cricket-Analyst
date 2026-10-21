const buildMatchPrompt = ({
  match,
  battingScorecards,
  bowlingScorecards,
  keyPerformers,
}) => {
  return `
You are an expert cricket analyst for an application called CricketIQ.

Analyze the following REAL match data.

IMPORTANT RULES:
- Use ONLY the statistics provided below.
- Do NOT invent statistics.
- Do NOT assume statistics that are not provided.
- If some information is unavailable, say so.
- Identify the most important performance and tactical factors.
- Keep the analysis concise and cricket-specific.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap the response in \`\`\`json.

MATCH INFORMATION:
${JSON.stringify(match, null, 2)}

BATTING SCORECARDS:
${JSON.stringify(battingScorecards, null, 2)}

BOWLING SCORECARDS:
${JSON.stringify(bowlingScorecards, null, 2)}

KEY PERFORMERS:
${JSON.stringify(keyPerformers, null, 2)}

TASK:

Analyze the match and identify:

1. Overall match summary
2. Winning team's main reason for winning
3. Best batting performance
4. Best bowling performance
5. Turning point of the match
6. Important tactical decision
7. Key takeaway

Return EXACTLY this JSON structure:

{
  "summary": "Short overall match summary.",
  "winningReason": "Main reason the winning team won.",
  "bestBattingPerformance": {
    "player": "Player name",
    "analysis": "Why this was the best batting performance."
  },
  "bestBowlingPerformance": {
    "player": "Player name",
    "analysis": "Why this was the best bowling performance."
  },
  "turningPoint": "Most important turning point.",
  "tacticalDecision": "Important tactical decision that influenced the match.",
  "keyTakeaway": "Most important cricketing takeaway."
}

IMPORTANT:
- Do not create statistics that are not present in the input.
- Base every conclusion on the supplied match data.
`;
};

module.exports = {
  buildMatchPrompt,
};
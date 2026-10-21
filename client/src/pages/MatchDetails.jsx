import { useEffect, useState } from "react";
import {
  getMatchById,
  getMatchAnalytics,
  getAIMatchSummary,
} from "../services/dashboardApi";
import "./MatchDetails.css";

function MatchDetails({ matchId, onBack }) {

  const getResultText = () => {
  if (!match?.result) return "Result unavailable";

  try {
    const result = JSON.parse(match.result);

    if (result.by?.wickets) {
      return `Won by ${result.by.wickets} wickets`;
    }

    if (result.by?.runs) {
      return `Won by ${result.by.runs} runs`;
    }

    if (result.result) {
      return result.result;
    }

    return "Match completed";
  } catch (error) {
    return "Result unavailable";
  }
};

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchAnalytics, setMatchAnalytics] = useState(null);

  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

const loadMatch = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getMatchById(matchId);
    setMatch(data.match);

    const analyticsData = await getMatchAnalytics(matchId);
    setMatchAnalytics(analyticsData);
  } catch (error) {
    console.error("Match details loading error:", error);
    setError("Unable to load match details. Please try again.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadMatch();
}, [matchId]);


  if (loading) {
  return (
    <div className="match-details-state">
      <div className="match-details-loader"></div>
      <p>Loading match details...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="match-details-error">
      <h3>Unable to load match details</h3>
      <p>{error}</p>

      <button
        className="match-details-retry-button"
        onClick={loadMatch}
      >
        Try Again
      </button>
    </div>
  );
}

if (!match) {
  return null;
}

  return (
    <div className="match-details-page">
      <button className="match-back-button" onClick={onBack}>
        ← Back to Matches
      </button>

      <div className="match-details-header">
        <p className="match-details-label">MATCH DETAILS</p>

        <h1>
          {match.teams?.[0]?.name || "Team 1"} vs{" "}
          {match.teams?.[1]?.name || "Team 2"}
        </h1>

        <p className="match-details-subtitle">
          {match.competition} · {match.format}
        </p>
      </div>

      <div className="match-details-grid">
        <div className="match-detail-card">
          <span>Date</span>
          <strong>
            {match.date
              ? new Date(match.date).toLocaleDateString()
              : "—"}
          </strong>
        </div>

        <div className="match-detail-card">
          <span>Venue</span>
          <strong>{match.venue || "—"}</strong>
        </div>

        <div className="match-detail-card">
          <span>Season</span>
          <strong>{match.season || "—"}</strong>
        </div>

        <div className="match-detail-card">
          <span>Winner</span>
          <strong>{match.winner?.name || "—"}</strong>
        </div>
      </div>

      <div className="match-result-section">
         <p className="match-details-label">MATCH RESULT</p>

       <div className="match-result-card">
         <span>Winner</span>
         <strong>{match.winner?.name || "—"}</strong>
         <p>{getResultText()}</p>
       </div>

     </div>

<div className="match-teams-section">
  <p className="match-details-label">TEAMS</p>

  <div className="match-teams-grid">
    {match.teams?.map((team) => (
      <div className="match-team-card" key={team._id}>
        <span>TEAM</span>
        <strong>{team.name}</strong>
      </div>
    ))}
  </div>
</div>

<div className="match-overview-section">
  <p className="match-details-label">MATCH OVERVIEW</p>

  <div className="match-overview-card">
    <div>
      <span>Competition</span>
      <strong>{match.competition || "—"}</strong>
    </div>

    <div>
      <span>Format</span>
      <strong>{match.format || "—"}</strong>
    </div>

    <div>
      <span>Season</span>
      <strong>{match.season || "—"}</strong>
    </div>

    <div>
      <span>Venue</span>
      <strong>{match.venue || "—"}</strong>
    </div>
  </div>
</div>


<div className="ai-match-summary-section">
  <p className="match-details-label">AI MATCH SUMMARY</p>

  <button
  className="generate-ai-button"
  disabled={aiLoading}
  onClick={async () => {
  try {
    setAiLoading(true);
    setAiError("");

    const aiData = await getAIMatchSummary(matchId);

    console.log("AI MATCH SUMMARY RESPONSE:", aiData);

    setAiSummary(aiData);
  } catch (error) {
    console.error("AI match summary error:", error);
    setAiError(
      "AI insights are temporarily unavailable. Please try again later."
    );
  } finally {
    setAiLoading(false);
  }
}}
>
  {aiLoading
  ? "Generating AI Summary..."
  : " ✨Generate AI Match Summary"}
</button>

{aiError && (
  <p className="ai-match-error">
    {aiError}
  </p>
)}

  {aiSummary?.aiInsights && (
    <div className="ai-match-summary-grid">
      <div className="ai-match-card ai-match-summary">
        <span>SUMMARY</span>
        <p>{aiSummary.aiInsights.summary}</p>
      </div>

      <div className="ai-match-card">
        <span>WINNING REASON</span>
        <p>{aiSummary.aiInsights.winningReason}</p>
      </div>

      <div className="ai-match-card">
        <span>TURNING POINT</span>
        <p>{aiSummary.aiInsights.turningPoint}</p>
      </div>

      <div className="ai-match-card">
        <span>TACTICAL DECISION</span>
        <p>{aiSummary.aiInsights.tacticalDecision}</p>
      </div>

      <div className="ai-match-card">
        <span>KEY TAKEAWAY</span>
        <p>{aiSummary.aiInsights.keyTakeaway}</p>
      </div>

      <div className="ai-match-card">
        <span>BEST BATTING PERFORMANCE</span>
        <p>
          <strong>
            {aiSummary.aiInsights.bestBattingPerformance?.player}
          </strong>
          {" — "}
          {aiSummary.aiInsights.bestBattingPerformance?.analysis}
        </p>
      </div>

      <div className="ai-match-card">
        <span>BEST BOWLING PERFORMANCE</span>
        <p>
          <strong>
            {aiSummary.aiInsights.bestBowlingPerformance?.player}
          </strong>
          {" — "}
          {aiSummary.aiInsights.bestBowlingPerformance?.analysis}
        </p>
      </div>
    </div>
  )}
</div>


{/* <div className="match-scorecard-section">
  <p className="match-details-label">BATTING SCORECARD</p>

  {matchAnalytics?.inningsScorecards?.length > 0 ? (
    matchAnalytics.inningsScorecards.map((innings, index) => (
      <div key={innings.inningsId || index}>
        <h3 className="innings-scorecard-title">
          {innings.team || `Innings ${index + 1}`}
        </h3>

        <div className="scorecard-table">
          <div className="scorecard-row scorecard-header">
            <span>PLAYER</span>
            <span>RUNS</span>
            <span>BALLS</span>
            <span>4s</span>
            <span>6s</span>
            <span>SR</span>
          </div>

          {innings.battingScorecards?.map((player, playerIndex) => (
            <div
              className="scorecard-row"
              key={player.player?._id || player.player || playerIndex}
            >
              <strong>
                {typeof player.player === "object"
                  ? player.player.name
                  : player.player || "Unknown Player"}
              </strong>
              <span>{player.runs ?? 0}</span>
              <span>{player.balls ?? 0}</span>
              <span>{player.fours ?? 0}</span>
              <span>{player.sixes ?? 0}</span>
              <span>{player.strikeRate ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    ))
  ) : (
    <p>No batting scorecard available.</p>
  )}
</div>

<div className="match-scorecard-section">
  <p className="match-details-label">BOWLING SCORECARD</p>

  {matchAnalytics?.inningsScorecards?.length > 0 ? (
    matchAnalytics.inningsScorecards.map((innings, index) => (
      <div key={innings.inningsId || index}>
        <h3 className="innings-scorecard-title">
          {innings.team || `Innings ${index + 1}`}
        </h3>

        <div className="scorecard-table">
          <div className="scorecard-row bowling-scorecard-header">
            <span>PLAYER</span>
            <span>OVERS</span>
            <span>RUNS</span>
            <span>WICKETS</span>
            <span>ECONOMY</span>
          </div>

          {innings.bowlingScorecards?.map((player, playerIndex) => (
            <div
              className="scorecard-row bowling-scorecard-row"
              key={player.player?._id || player.player || playerIndex}
            >
              <strong>
                {typeof player.player === "object"
                  ? player.player.name
                  : player.player || "Unknown Player"}
              </strong>
              <span>{player.overs ?? 0}</span>
              <span>{player.runsConceded ?? 0}</span>
              <span>{player.wickets ?? 0}</span>
              <span>{player.economy ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    ))
  ) : (
    <p>No bowling scorecard available.</p>
  )}
</div> */}



<div className="match-scorecard-section">
  {matchAnalytics?.inningsScorecards?.length > 0 ? (
    matchAnalytics.inningsScorecards.map((innings, index) => (
      <div key={innings.inningsId || index}>
        <h2 className="innings-scorecard-title">
          {`INNINGS ${innings.inningsNumber || index + 1}`}
          {" — "}
          {innings.team || "Unknown Team"}
        </h2>

        {/* Batting scorecard */}
        <p className="match-details-label">BATTING SCORECARD</p>

        <div className="scorecard-table">
          <div className="scorecard-row scorecard-header">
            <span>PLAYER</span>
            <span>RUNS</span>
            <span>BALLS</span>
            <span>4s</span>
            <span>6s</span>
            <span>SR</span>
          </div>

          {innings.battingScorecards?.map((player, playerIndex) => (
            <div
              className="scorecard-row"
              key={player.player?._id || player.player || playerIndex}
            >
              <strong>
                {typeof player.player === "object"
                  ? player.player.name
                  : player.player || "Unknown Player"}
              </strong>
              <span>{player.runs ?? 0}</span>
              <span>{player.balls ?? 0}</span>
              <span>{player.fours ?? 0}</span>
              <span>{player.sixes ?? 0}</span>
              <span>{player.strikeRate ?? 0}</span>
            </div>
          ))}
        </div>

        {/* Bowling scorecard */}
        <p className="match-details-label">BOWLING SCORECARD</p>

        <div className="scorecard-table">
          <div className="scorecard-row bowling-scorecard-header">
            <span>PLAYER</span>
            <span>OVERS</span>
            <span>RUNS</span>
            <span>WICKETS</span>
            <span>ECONOMY</span>
          </div>

          {innings.bowlingScorecards?.map((player, playerIndex) => (
            <div
              className="scorecard-row bowling-scorecard-row"
              key={player.player?._id || player.player || playerIndex}
            >
              <strong>
                {typeof player.player === "object"
                  ? player.player.name
                  : player.player || "Unknown Player"}
              </strong>
              <span>{player.overs ?? 0}</span>
              <span>{player.runsConceded ?? 0}</span>
              <span>{player.wickets ?? 0}</span>
              <span>{player.economy ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    ))
  ) : (
    <p>No innings scorecards available.</p>
  )}
</div>



    </div>
  );
}

export default MatchDetails;
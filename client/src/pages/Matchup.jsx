import { useEffect, useState } from "react";
import {
  getPlayers,
  getMatchupAnalytics,
  getMatchupPhaseAnalysis,
  getAIMatchupInsights,
} from "../services/dashboardApi";

import "./Matchup.css";

function Matchup() {
  const [selectedBatter, setSelectedBatter] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const [matchup, setMatchup] = useState(null);
  const [loadingMatchup, setLoadingMatchup] = useState(false);
  const [matchupError, setMatchupError] = useState("");
  const [phaseAnalysis, setPhaseAnalysis] = useState(null);

  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
  const loadPlayers = async () => {
    try {
      const data = await getPlayers();

      setPlayers(data.players ?? []);
    } catch (error) {
      console.error("Matchup players loading error:", error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  loadPlayers();
}, []);

const handleAnalyzeMatchup = async () => {
  if (!selectedBatter || !selectedBowler) {
    setMatchupError("Please select both a batter and a bowler.");
    return;
  }

  try {
    setLoadingMatchup(true);
    setMatchupError("");
    setMatchup(null);
    setPhaseAnalysis(null);

    const data = await getMatchupAnalytics(
      selectedBatter,
      selectedBowler
    );

    console.log("MATCHUP ANALYTICS RESPONSE:", data);

    setMatchup(data.matchup);

    const phaseData = await getMatchupPhaseAnalysis(
    selectedBatter,
    selectedBowler
     );

    console.log("MATCHUP PHASE RESPONSE:", phaseData);

    setPhaseAnalysis(phaseData.stats);


  } catch (error) {
    console.error("Matchup analytics error:", error);
    setMatchupError("Unable to load matchup analytics.");
  } finally {
    setLoadingMatchup(false);
  }
};


const handleGenerateAI = async () => {
  if (!selectedBatter || !selectedBowler) {
    setAiError("Please select both a batter and a bowler.");
    return;
  }

  try {
    setAiLoading(true);
    setAiError("");
    setAiInsights(null);

    const data = await getAIMatchupInsights(
      selectedBatter,
      selectedBowler
    );

    console.log("AI MATCHUP RESPONSE:", data);

    setAiInsights(data.aiInsights);
  } catch (error) {
    console.error("AI matchup error:", error);

    setAiError(
      "AI matchup insights are temporarily unavailable. Please try again later."
    );
  } finally {
    setAiLoading(false);
  }
};

  return (
    <div className="matchup-page">
      <p className="matchup-label">MATCHUP ANALYTICS</p>

      <h1>Batter vs Bowler</h1>

      <div className="matchup-selection-card">
        <div className="matchup-select-group">
          <label>BATTER</label>

          <select
            value={selectedBatter}
            onChange={(e) => setSelectedBatter(e.target.value)}
          >
            <option value="">
             {loadingPlayers ? "Loading players..." : "Select batter"}
            </option>

            {players.map((player) => (
             <option key={player._id} value={player._id}>
              {player.name}
            </option>
            ))}

          </select>
        </div>

        <div className="matchup-vs">VS</div>

        <div className="matchup-select-group">
          <label>BOWLER</label>

          <select
            value={selectedBowler}
            onChange={(e) => setSelectedBowler(e.target.value)}
          >
            <option value="">
            {loadingPlayers ? "Loading players..." : "Select bowler"}
             </option>

            {players.map((player) => (
           <option key={player._id} value={player._id}>
             {player.name}
           </option>
           ))}

          </select>
        </div>
      </div>

      <button
       className="matchup-analyze-button"
       onClick={handleAnalyzeMatchup}
       disabled={loadingMatchup}
       >
      {loadingMatchup
         ? "Analyzing..."
         : "Analyze Matchup →"}
      </button>

      {loadingMatchup && (
        <div className="matchup-loading-state">
         <div className="matchup-loader"></div>
          <p>Analyzing batter vs bowler statistics...</p>
       </div>
     )}

     {matchupError && (
  <div className="matchup-error-panel">
    <h3>Unable to analyze matchup</h3>
    <p>{matchupError}</p>
    <button
      className="matchup-retry-button"
      onClick={handleAnalyzeMatchup}
      disabled={loadingMatchup}
    >
      Try Again
    </button>
  </div>
)}

      <section className="matchup-section">
        <p className="matchup-label">MATCHUP OVERVIEW</p>

        <div className="matchup-stats-grid">
          <div className="matchup-stat-card">
            <span>BALLS</span>
            <strong>{matchup?.balls ?? "—"}</strong>
          </div>

          <div className="matchup-stat-card">
            <span>RUNS</span>
            <strong>{matchup?.runs ?? "—"}</strong>
          </div>

          <div className="matchup-stat-card">
            <span>4s</span>
            <strong>{matchup?.fours ?? "—"}</strong>
          </div>

          <div className="matchup-stat-card">
            <span>6s</span>
            <strong>{matchup?.sixes ?? "—"}</strong>
          </div>

          <div className="matchup-stat-card">
            <span>STRIKE RATE</span>
            <strong>{matchup?.strikeRate ?? "—"}</strong>
          </div>
        </div>
      </section>

      <section className="matchup-section">
        <p className="matchup-label">PHASE-WISE MATCHUP</p>

        <div className="matchup-phase-grid">
         <div className="matchup-phase-card">
        <span>POWERPLAY</span>

       <strong>
         {phaseAnalysis?.powerplay?.runs ?? "—"}
       </strong>

       <p>
         {phaseAnalysis?.powerplay?.balls ?? 0} balls ·{" "}
         {phaseAnalysis?.powerplay?.runs ?? 0} runs
       </p>

       <small>
          SR: {phaseAnalysis?.powerplay?.strikeRate ?? 0}
         </small>
      </div>

         <div className="matchup-phase-card">
          <span>MIDDLE</span>

         <strong>
          {phaseAnalysis?.middle?.runs ?? "—"}
         </strong>

         <p>
           {phaseAnalysis?.middle?.balls ?? 0} balls ·{" "}
           {phaseAnalysis?.middle?.runs ?? 0} runs
         </p>

         <small>
           SR: {phaseAnalysis?.middle?.strikeRate ?? 0}
        </small>
       </div>

          <div className="matchup-phase-card">
          <span>DEATH</span>

         <strong>
          {phaseAnalysis?.death?.runs ?? "—"}
        </strong>

        <p>
          {phaseAnalysis?.death?.balls ?? 0} balls ·{" "}
          {phaseAnalysis?.death?.runs ?? 0} runs
       </p>

       <small>
          SR: {phaseAnalysis?.death?.strikeRate ?? 0}
         </small>
       </div>

       </div>

      </section>

      <section className="matchup-section">
  <p className="matchup-label">KEY MATCHUP STATS</p>

  <div className="matchup-key-stats">
    <div>
      <span>4s</span>
      <strong>{matchup?.fours ?? "—"}</strong>
    </div>

    <div>
      <span>6s</span>
      <strong>{matchup?.sixes ?? "—"}</strong>
    </div>

    <div>
      <span>DOT BALLS</span>
      <strong>{matchup?.dotBalls ?? "—"}</strong>
    </div>

    <div>
      <span>DISMISSALS</span>
      <strong>{matchup?.dismissals ?? "—"}</strong>
    </div>
  </div>
</section>

<section className="matchup-section ai-matchup-section">
  <p className="matchup-label">AI MATCHUP INSIGHTS</p>

  <button
    className="generate-ai-matchup-button"
    onClick={handleGenerateAI}
    disabled={aiLoading || !selectedBatter || !selectedBowler}
  >
    {aiLoading
      ? "Generating AI Analysis..."
      : " ✨Generate AI Matchup Analysis"}
  </button>

  {aiLoading && (
  <div className="ai-matchup-loading">
    <div className="ai-matchup-loader"></div>
    <p>Generating AI insights. This may take a moment...</p>
  </div>
)}

  {aiError && (
  <div className="ai-matchup-error-panel">
    <h3>Unable to generate AI insights</h3>
    <p>{aiError}</p>

    <button
      className="ai-matchup-retry-button"
      onClick={handleGenerateAI}
      disabled={aiLoading || !selectedBatter || !selectedBowler}
    >
      Try Again
    </button>
  </div>
)}

  {aiInsights && (
    <div className="ai-matchup-grid">

      <div className="ai-matchup-card ai-matchup-summary">
        <span>SUMMARY</span>
        <p>{aiInsights.summary}</p>
      </div>

      <div className="ai-matchup-card">
        <span>BATTER ADVANTAGE</span>
        <p>{aiInsights.batterAdvantage}</p>
      </div>

      <div className="ai-matchup-card">
        <span>KEY INSIGHT</span>
        <p>{aiInsights.keyInsight}</p>
      </div>

      <div className="ai-matchup-card">
        <span>BOWLING STRATEGY</span>

        <ul>
          {aiInsights.bowlingStrategy?.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      </div>

      <div className="ai-matchup-card">
        <span>BATTING STRATEGY</span>

        <ul>
          {aiInsights.battingStrategy?.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      </div>

      <div className="ai-matchup-card">
        <span>CONFIDENCE</span>
        <p>{aiInsights.confidence}</p>
      </div>

    </div>
  )}
</section>
    </div>
  );
}


export default Matchup;
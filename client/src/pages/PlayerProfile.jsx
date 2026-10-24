import { useEffect, useState, useRef } from "react";
import {
  getPlayerPerformance,
  getPlayerPhaseAnalysis,
   getPlayerBowlingPhaseAnalysis,
   getAIPlayerInsights,
} from "../services/dashboardApi";
import PlayerAvatar from "../components/PlayerAvatar";
import "./PlayerProfile.css";

function PlayerProfile({ playerId,player, onBack }) {
  const [performance, setPerformance] = useState(null);
  const [phaseAnalysis, setPhaseAnalysis] = useState(null);
  const [bowlingPhaseAnalysis, setBowlingPhaseAnalysis] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


const handleGenerateAI = async () => {
  try {
    setAiLoading(true);
    setAiError("");
    setAiInsights(null);

    const aiData = await getAIPlayerInsights(playerId);

    if (aiData.success) {
      setAiInsights(aiData.insights);
    } else {
      throw new Error(
        aiData.message || "Failed to generate player insights"
      );
    }
  } catch (error) {
    console.error("Player AI insights error:", error);
    setAiError(
      error.message || "Unable to generate player insights"
    );
  } finally {
    setAiLoading(false);
  }
};

 const loadPerformance = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getPlayerPerformance(playerId);
    setPerformance(data.performance ?? data);

    const phaseData = await getPlayerPhaseAnalysis(playerId);
    setPhaseAnalysis(phaseData);

    const bowlingPhaseData =
      await getPlayerBowlingPhaseAnalysis(playerId);
    setBowlingPhaseAnalysis(bowlingPhaseData);

    // Keep the existing AI request protection.
    // if (aiRequestPlayerRef.current !== playerId) {
    //   aiRequestPlayerRef.current = playerId;

    //   setAiLoading(true);
    //   setAiError("");

    //   try {
    //     const aiData = await getAIPlayerInsights(playerId);

    //     if (aiData.success) {
    //       setAiInsights(aiData.insights);
    //     } else {
    //       throw new Error("Failed to load AI insights");
    //     }
    //   } catch (error) {
    //     console.error("Player AI insights error:", error);
    //     setAiError("Unable to load AI insights");
    //   } finally {
    //     setAiLoading(false);
    //   }
    // }
  } catch (error) {
    console.error("Player performance error:", error);
    setError("Unable to load player performance");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadPerformance();
}, [playerId]);

  return (
        <div className="player-profile-page">
       <button className="profile-back-button" onClick={onBack}>
       ← Back to Players
      </button>

      <div className="player-profile-header">
      <div className="player-header-content">
      <PlayerAvatar
        name={player?.name}
        size="large"
      />
      <div className="player-header-info">
      <p className="profile-label">PLAYER PROFILE</p>
      <h1>{player?.name || "Player Profile"}</h1>
      <p className="profile-subtitle">
      Career performance and cricket intelligence
      </p>

     <div className="player-profile-meta">
     <span>TEAM</span>
     <strong>{player?.country || "—"}</strong>
    </div>
    </div>
    </div>
    </div>

      {loading && (
  <div className="profile-loading">
    <div className="profile-loading-spinner"></div>

    <div>
      <p className="profile-loading-title">
        Loading player analytics
      </p>

      <p className="profile-loading-text">
        Fetching performance and phase-wise statistics...
      </p>
    </div>
  </div>
)}

{error && !loading && (
  <div className="profile-error">
    <div className="profile-error-icon">!</div>

    <div>
      <p className="profile-error-title">
        Unable to load player analytics
      </p>

      <p className="profile-error-text">
        We couldn't fetch the player's performance data.
        Please try again.
      </p>

      <button
        className="profile-retry-button"
        onClick={loadPerformance}
        disabled={loading}
      >
        Try Again
      </button>
    </div>
  </div>
)}

      {performance && !loading && !error && (

<div className="player-stats-section">
        <p className="profile-label">BATTING PERFORMANCE</p>

 <div className="player-stats-grid">
    <div className="player-stat-card">
      <span>Matches</span>
      <strong>{performance.batting?.matches ?? 0}</strong>
    </div>

    <div className="player-stat-card">
      <span>Runs</span>
      <strong>{performance.batting?.runs ?? 0}</strong>
    </div>

    <div className="player-stat-card">
      <span>Average</span>
      <strong>{performance.batting?.average ?? 0}</strong>
    </div>

    <div className="player-stat-card">
      <span>Strike Rate</span>
      <strong>{performance.batting?.strikeRate ?? 0}</strong>
    </div>
  </div>

  <div className="player-secondary-section">
  <p className="profile-label">ADDITIONAL PERFORMANCE</p>

  <div className="player-secondary-grid">
    <div className="player-secondary-card">
      <span>Fours</span>
      <strong>{performance.batting?.fours ?? 0}</strong>
    </div>

    <div className="player-secondary-card">
      <span>Sixes</span>
      <strong>{performance.batting?.sixes ?? 0}</strong>
    </div>

    <div className="player-secondary-card">
      <span>Dismissals</span>
      <strong>{performance.batting?.dismissals ?? 0}</strong>
    </div>

    <div className="player-secondary-card">
      <span>Wickets</span>
      <strong>{performance.bowling?.wickets ?? 0}</strong>
    </div>
  </div>
</div>


<div className="player-summary-section">
  <p className="profile-label">CAREER SUMMARY</p>

  <div className="player-summary-card">
    <div className="player-summary-item">
      <span>Innings</span>
      <strong>{performance.batting?.innings ?? 0}</strong>
    </div>

    <div className="player-summary-item">
      <span>Balls Faced</span>
      <strong>{performance.batting?.balls ?? 0}</strong>
    </div>

    <div className="player-summary-item">
      <span>Fours</span>
      <strong>{performance.batting?.fours ?? 0}</strong>
    </div>

    <div className="player-summary-item">
      <span>Sixes</span>
      <strong>{performance.batting?.sixes ?? 0}</strong>
    </div>
  </div>
</div>


<div className="phase-snapshot-section">
  <p className="profile-label">BATTING PHASE SNAPSHOT</p>

  <div className="phase-snapshot-grid">
    <div className="phase-snapshot-card">
      <span>Powerplay SR</span>
      <strong>
        {phaseAnalysis?.phaseAnalysis?.powerplay?.strikeRate ?? 0}
      </strong>
    </div>

    <div className="phase-snapshot-card">
      <span>Middle Overs SR</span>
      <strong>
        {phaseAnalysis?.phaseAnalysis?.middle?.strikeRate ?? 0}
      </strong>
    </div>

    <div className="phase-snapshot-card">
      <span>Death Overs SR</span>
      <strong>
        {phaseAnalysis?.phaseAnalysis?.death?.strikeRate ?? 0}
      </strong>
    </div>
  </div>
</div>


<div className="phase-snapshot-section">
  <p className="profile-label">BOWLING PHASE SNAPSHOT</p>

  <div className="phase-snapshot-grid">
    <div className="phase-snapshot-card">
      <span>Powerplay Economy</span>
      <strong>
        {bowlingPhaseAnalysis?.stats?.powerplay?.economy ?? 0}
      </strong>
    </div>

    <div className="phase-snapshot-card">
      <span>Middle Overs Economy</span>
      <strong>
        {bowlingPhaseAnalysis?.stats?.middle?.economy ?? 0}
      </strong>
    </div>

    <div className="phase-snapshot-card">
      <span>Death Overs Economy</span>
      <strong>
        {bowlingPhaseAnalysis?.stats?.death?.economy ?? 0}
      </strong>
    </div>
  </div>
</div>


<div className="performance-overview-section">
  <p className="profile-label">PERFORMANCE OVERVIEW</p>

  <div className="performance-overview-grid">
    <div className="performance-overview-card">
      <span>Runs</span>
      <strong>{performance.batting?.runs ?? 0}</strong>
      <small>Batting</small>
    </div>

    <div className="performance-overview-card">
      <span>Average</span>
      <strong>{performance.batting?.average ?? 0}</strong>
      <small>Batting</small>
    </div>

    <div className="performance-overview-card">
      <span>Strike Rate</span>
      <strong>{performance.batting?.strikeRate ?? 0}</strong>
      <small>Batting</small>
    </div>

    <div className="performance-overview-card">
      <span>Wickets</span>
      <strong>{performance.bowling?.wickets ?? 0}</strong>
      <small>Bowling</small>
    </div>
  </div>
</div>



<div className="phase-analysis-section">
  <p className="profile-label">PHASE-WISE BATTING</p>

  <div className="phase-analysis-grid">
    <div className="phase-card">
      <span className="phase-name">Powerplay</span>

      <strong>
        {phaseAnalysis?.phaseAnalysis?.powerplay?.runs ?? 0}
      </strong>

      <p>
        {phaseAnalysis?.phaseAnalysis?.powerplay?.balls ?? 0} balls
      </p>

      <div className="phase-strike-rate">
        SR {phaseAnalysis?.phaseAnalysis?.powerplay?.strikeRate ?? 0}
      </div>
    </div>

    <div className="phase-card">
      <span className="phase-name">Middle Overs</span>

      <strong>
        {phaseAnalysis?.phaseAnalysis?.middle?.runs ?? 0}
      </strong>

      <p>
        {phaseAnalysis?.phaseAnalysis?.middle?.balls ?? 0} balls
      </p>

      <div className="phase-strike-rate">
        SR {phaseAnalysis?.phaseAnalysis?.middle?.strikeRate ?? 0}
      </div>
    </div>

    <div className="phase-card">
      <span className="phase-name">Death Overs</span>

      <strong>
        {phaseAnalysis?.phaseAnalysis?.death?.runs ?? 0}
      </strong>

      <p>
        {phaseAnalysis?.phaseAnalysis?.death?.balls ?? 0} balls
      </p>

      <div className="phase-strike-rate">
        SR {phaseAnalysis?.phaseAnalysis?.death?.strikeRate ?? 0}
      </div>
    </div>
  </div>
</div>


<div className="phase-analysis-section">
  <p className="profile-label">PHASE-WISE BOWLING</p>

  <div className="phase-analysis-grid">
    <div className="phase-card">
      <span className="phase-name">Powerplay</span>

      <strong>
        {bowlingPhaseAnalysis?.stats?.powerplay?.wickets ?? 0}
      </strong>

      <p>
         {bowlingPhaseAnalysis?.stats?.powerplay?.runsConceded ?? 0} runs conceded
       · {bowlingPhaseAnalysis?.stats?.powerplay?.dotBalls ?? 0} dot balls
      </p>

      <div className="phase-strike-rate">
        Economy{" "}
        {bowlingPhaseAnalysis?.stats?.powerplay?.economy ?? 0}
      </div>
    </div>

    <div className="phase-card">
      <span className="phase-name">Middle Overs</span>

      <strong>
        {bowlingPhaseAnalysis?.stats?.middle?.wickets ?? 0}
      </strong>

      <p>
         {bowlingPhaseAnalysis?.stats?.middle?.runsConceded ?? 0} runs conceded
       · {bowlingPhaseAnalysis?.stats?.middle?.dotBalls ?? 0} dot balls
      </p>

      <div className="phase-strike-rate">
        Economy{" "}
        {bowlingPhaseAnalysis?.stats?.middle?.economy ?? 0}
      </div>
    </div>

    <div className="phase-card">
      <span className="phase-name">Death Overs</span>

      <strong>
        {bowlingPhaseAnalysis?.stats?.death?.wickets ?? 0}
      </strong>

      <p>
       {bowlingPhaseAnalysis?.stats?.death?.runsConceded ?? 0} runs conceded
       · {bowlingPhaseAnalysis?.stats?.death?.dotBalls ?? 0} dot balls
     </p>

      <div className="phase-strike-rate">
        Economy{" "}
        {bowlingPhaseAnalysis?.stats?.death?.economy ?? 0}
      </div>
    </div>
  </div>
</div>


{/* AI PLAYER INSIGHTS */}
<div className="ai-player-insights-section">
  <div className="ai-insights-header">
    <div>
      <p className="profile-label">AI PLAYER INSIGHTS</p>
      <p className="ai-insights-description">
        Get an AI-powered analysis of this player's performance.
      </p>
    </div>

    <button
      className="generate-ai-insights-button"
      onClick={handleGenerateAI}
      disabled={aiLoading}
    >
      {aiLoading ? "Generating..." : "✨ Generate Player Insights"}
    </button>
  </div>

  {aiLoading && (
    <div className="ai-insights-loading">
      <p>Generating AI insights...</p>
    </div>
  )}

  {aiError && !aiLoading && (
  <div className="ai-insights-error">
    <p>{aiError}</p>

    <button
      className="ai-insights-retry-button"
      onClick={handleRetryAI}
      disabled={aiLoading}
    >
      Try Again
    </button>
  </div>
)}

  {aiInsights && !aiLoading && !aiError && (
    <div className="ai-insights-grid">

      <div className="ai-insight-card ai-insight-summary">
        <span className="ai-insight-label">SUMMARY</span>
        <p>{aiInsights.summary}</p>
      </div>

      <div className="ai-insight-card">
        <span className="ai-insight-label">STRENGTHS</span>

        <ul>
          {aiInsights.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="ai-insight-card">
        <span className="ai-insight-label">WEAKNESSES</span>

        <ul>
          {aiInsights.weaknesses?.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </div>

      <div className="ai-insight-card ai-insight-recommendation">
        <span className="ai-insight-label">
          TACTICAL RECOMMENDATION
        </span>

        <p>{aiInsights.tacticalRecommendation}</p>
      </div>

    </div>
  )}
</div>

</div>
  


      )}
    </div>
  );
}

export default PlayerProfile;

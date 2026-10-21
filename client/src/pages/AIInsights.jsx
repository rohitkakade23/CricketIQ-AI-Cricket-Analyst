import { useEffect, useState } from "react";
import {
  getPlayers,
  getMatches,
  getAIPlayerInsights,
  getAIMatchSummary,
  getAIMatchupInsights,
} from "../services/dashboardApi";
import "./AIInsights.css";

function AIInsights() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedBatter, setSelectedBatter] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");

  const [playerInsights, setPlayerInsights] = useState(null);
  const [matchSummary, setMatchSummary] = useState(null);
  const [matchupInsights, setMatchupInsights] = useState(null);

  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingPlayerInsights, setLoadingPlayerInsights] = useState(false);
  const [loadingMatchSummary, setLoadingMatchSummary] = useState(false);
  const [loadingMatchup, setLoadingMatchup] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingPlayers(true);
        setError("");

        const [playersData, matchesData] = await Promise.all([
          getPlayers(),
          getMatches(),
        ]);

        if (playersData.success === false || matchesData.success === false) {
          throw new Error("Unable to load players or matches.");
        }

        setPlayers(playersData.players || []);
        setMatches(matchesData.matches || []);
      } catch (err) {
        console.error("AI Insights data loading error:", err);
        setError("Unable to load players and matches. Please try again.");
      } finally {
        setLoadingPlayers(false);
      }
    };

    loadData();
  }, []);

  const generatePlayerInsights = async () => {
    if (!selectedPlayer) {
      setError("Please select a player first.");
      return;
    }

    try {
      setError("");
      setLoadingPlayerInsights(true);
      setPlayerInsights(null);

      const data = await getAIPlayerInsights(selectedPlayer);

      if (data.success === false) {
        throw new Error(data.message || "Failed to generate player insights.");
      }

      setPlayerInsights(data);
    } catch (err) {
      console.error("Player insights error:", err);
      setError(err.message || "Unable to generate player insights.");
    } finally {
      setLoadingPlayerInsights(false);
    }
  };

  const generateMatchSummary = async () => {
    if (!selectedMatch) {
      setError("Please select a match first.");
      return;
    }

    try {
      setError("");
      setLoadingMatchSummary(true);
      setMatchSummary(null);

      const data = await getAIMatchSummary(selectedMatch);

      if (data.success === false) {
        throw new Error(data.message || "Failed to generate match summary.");
      }

      setMatchSummary(data);
    } catch (err) {
      console.error("Match summary error:", err);
      setError(err.message || "Unable to generate match summary.");
    } finally {
      setLoadingMatchSummary(false);
    }
  };

  const generateMatchupInsights = async () => {
    if (!selectedBatter || !selectedBowler) {
      setError("Please select both a batter and a bowler.");
      return;
    }

    if (selectedBatter === selectedBowler) {
      setError("Please select two different players.");
      return;
    }

    try {
      setError("");
      setLoadingMatchup(true);
      setMatchupInsights(null);

      const data = await getAIMatchupInsights(selectedBatter, selectedBowler);

      if (data.success === false) {
        throw new Error(data.message || "Failed to generate matchup insights.");
      }

      setMatchupInsights(data);
    } catch (err) {
      console.error("Matchup insights error:", err);
      setError(err.message || "Unable to generate matchup insights.");
    } finally {
      setLoadingMatchup(false);
    }
  };

  const formatContent = (value) => {
    if (value == null) return "No information available.";

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <li key={index}>
          {typeof item === "object" ? formatContent(item) : String(item)}
        </li>
      ));
    }

    return (
      <div className="ai-result-fields">
        {Object.entries(value).map(([key, item]) => (
          <div className="ai-result-field" key={key}>
            <strong>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/[_-]/g, " ")
                .replace(/^./, (char) => char.toUpperCase())}
            </strong>
            <div>{formatContent(item)}</div>
          </div>
        ))}
      </div>
    );
  };

  if (loadingPlayers) {
    return (
      <div className="ai-insights-page">
        <div className="ai-insights-state">Loading players and matches...</div>
      </div>
    );
  }

  return (
    <div className="ai-insights-page">
      <header className="ai-insights-header">
        <div>
          <span className="ai-insights-eyebrow">CRICKETIQ INTELLIGENCE</span>
          <h1>AI Insights</h1>
          <p>Explore player performances, match summaries, and tactical matchups.</p>
        </div>
      </header>

      {error && (
        <div className="ai-insights-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      <div className="ai-insights-grid">
        {/* Player Insights */}
        <section className="ai-insight-card">
          <div className="ai-card-icon">🏏</div>
          <h2>Player Insights</h2>
          <p>Analyse an individual player's performance using AI.</p>

          <label htmlFor="ai-player">Select player</label>
          <select
            id="ai-player"
            value={selectedPlayer}
            onChange={(event) => setSelectedPlayer(event.target.value)}
          >
            <option value="">Choose a player</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={generatePlayerInsights}
            disabled={loadingPlayerInsights || !selectedPlayer}
          >
            {loadingPlayerInsights ? "Generating..." : "Generate Insights"}
          </button>

          {playerInsights && (
            <div className="ai-result">
              <h3>{playerInsights.player || "Player Analysis"}</h3>
              {formatContent(playerInsights.insights ?? playerInsights.analysis)}
            </div>
          )}
        </section>

        {/* Match Summary */}
        <section className="ai-insight-card">
          <div className="ai-card-icon">📊</div>
          <h2>Match Summary</h2>
          <p>Generate an AI-powered summary of a selected match.</p>

          <label htmlFor="ai-match">Select match</label>
          <select
            id="ai-match"
            value={selectedMatch}
            onChange={(event) => setSelectedMatch(event.target.value)}
          >
            <option value="">Choose a match</option>
           {matches.map((match) => {
            const teamNames = Array.isArray(match.teams)
            ? match.teams.map((team) =>
            typeof team === "object" ? team.name : null
            ).filter(Boolean)
            : [];

            const matchLabel =
            teamNames.length >= 2
            ? `${teamNames[0]} vs ${teamNames[1]}`
            : match.name || match.title || "Match";

            return (
            <option key={match._id} value={match._id}>
            {matchLabel}
          </option>
         );
         })}
          </select>

          <button
            type="button"
            onClick={generateMatchSummary}
            disabled={loadingMatchSummary || !selectedMatch}
          >
            {loadingMatchSummary ? "Generating..." : "Generate Summary"}
          </button>

          {matchSummary && (
            <div className="ai-result">
              <h3>Match Summary</h3>
              {formatContent(
                matchSummary.summary ??
                  matchSummary.analysis ??
                  matchSummary.insights
              )}
            </div>
          )}
        </section>

        {/* Batter vs Bowler */}
        <section className="ai-insight-card">
          <div className="ai-card-icon">⚔️</div>
          <h2>Batter vs Bowler</h2>
          <p>Explore a batter-bowler matchup with AI-generated observations.</p>

          <label htmlFor="ai-batter">Select batter</label>
          <select
            id="ai-batter"
            value={selectedBatter}
            onChange={(event) => setSelectedBatter(event.target.value)}
          >
            <option value="">Choose a batter</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>

          <label htmlFor="ai-bowler">Select bowler</label>
          <select
            id="ai-bowler"
            value={selectedBowler}
            onChange={(event) => setSelectedBowler(event.target.value)}
          >
            <option value="">Choose a bowler</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={generateMatchupInsights}
            disabled={loadingMatchup || !selectedBatter || !selectedBowler}
          >
            {loadingMatchup ? "Generating..." : "Analyse Matchup"}
          </button>

          {matchupInsights && (
            <div className="ai-result">
              <h3>
                {matchupInsights.batter?.name || "Batter"} vs{" "}
                {matchupInsights.bowler?.name || "Bowler"}
              </h3>
              {formatContent(
                matchupInsights.aiInsights ?? matchupInsights.insights
              )}
            </div>
          )}
        </section>

      </div>
    </div>

  );
}

export default AIInsights;
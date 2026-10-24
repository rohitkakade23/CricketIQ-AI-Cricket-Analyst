import { useEffect, useState } from "react";
import {
  getPlayers,
  getMatches,
  getTopPerformers,
  getTopBowlers,
 } from "../services/dashboardApi";
import PlayerAvatar from "../components/PlayerAvatar";

function Dashboard({ serverStatus }) {
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [recentMatches, setRecentMatches] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);

  // const [selectedPlayer, setSelectedPlayer] = useState("");
  // const [aiInsights, setAiInsights] = useState(null);
  // const [aiLoading, setAiLoading] = useState(false);
  // const [aiError, setAiError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [playersData, matchesData, performersData, bowlersData] = await Promise.all([
          getPlayers(),
          getMatches(),
          getTopPerformers(),
          getTopBowlers(),
        ]);
        // console.log("TOP PERFORMERS RESPONSE:", performersData);

        setPlayerCount(
          playersData.count ??
            playersData.players?.length ??
            0
        );
        setPlayers(playersData.players ?? []);

        setMatchCount(
          matchesData.count ??
            matchesData.matches?.length ??
            0
        );

        setTopPerformers(
          performersData.performers ?? []
        );
        setTopBowlers(bowlersData.bowlers ?? []);

        // Get recent matches
        const matches = matchesData.matches || [];

        const sortedMatches = [...matches]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentMatches(sortedMatches);
      } catch (error) {
        console.error("Dashboard data error:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Format match date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get result text
  const getResultText = (match) => {
    if (!match.result) {
      return match.winner?.name
        ? `${match.winner.name} won`
        : "Result unavailable";
    }

    try {
      const result =
        typeof match.result === "string"
          ? JSON.parse(match.result)
          : match.result;

      if (result.winner && result.by) {
        if (result.by.wickets !== undefined) {
          return `${result.winner} won by ${result.by.wickets} wickets`;
        }

        if (result.by.runs !== undefined) {
          return `${result.winner} won by ${result.by.runs} runs`;
        }
      }

      return result.winner
        ? `${result.winner} won`
        : "Match completed";
    } catch {
      return match.winner?.name
        ? `${match.winner.name} won`
        : "Match completed";
    }
  };

  return (
    <div className="dashboard">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <span className="eyebrow">
            CRICKET ANALYTICS
          </span>

          <h2>
            Understand the game
            <br />
            beyond the numbers.
          </h2>

          <p>
            Explore player performances, match statistics,
            tactical insights and AI-powered cricket analysis.
          </p>

        </div>

      </section>


      {/* Dashboard Cards */}
      <section className="dashboard-cards">

        {/* Players */}
        <div className="feature-card">

          <span className="card-label">
            Players
          </span>

          <h3>
            {loading ? "..." : playerCount}
          </h3>

          <p>
            Players in database
          </p>

        </div>


        {/* Matches */}
        <div className="feature-card">

          <span className="card-label">
            Matches
          </span>

          <h3>
            {loading ? "..." : matchCount}
          </h3>

          <p>
            Matches in database
          </p>

        </div>


        {/* AI Insights */}
        <div className="feature-card">

          <span className="card-label">
            AI Insights
          </span>

          <h3>
            AI
          </h3>

          <p>
            AI-powered cricket intelligence
          </p>

        </div>


        {/* Matchups */}
        <div className="feature-card">

          <span className="card-label">
            Matchups
          </span>

          <h3>
            Compare
          </h3>

          <p>
            Batter vs bowler analysis
          </p>

        </div>

      </section>


      {/* Recent Matches */}
      <section className="recent-matches">

        <div className="section-heading">
          <div>
            <span className="section-label">
              MATCH CENTER
            </span>

            <h3>
              Recent Matches
            </h3>

            <p>
              Latest matches available in CricketIQ
            </p>
          </div>
        </div>


        {loading ? (
          <div className="recent-matches-loading">
            Loading recent matches...
          </div>
        ) : recentMatches.length === 0 ? (
          <div className="recent-matches-empty">
            No matches available.
          </div>
        ) : (
          <div className="matches-list">

            {recentMatches.map((match) => (

              <div
                className="match-row"
                key={match._id}
              >

                {/* Date */}
                <div className="match-date">
                  <span>
                    {formatDate(match.date)}
                  </span>

                  <small>
                    {match.format || "Match"}
                  </small>
                </div>


                {/* Teams */}
                <div className="match-teams">

                  <div>
                    {match.teams?.[0]?.name || "Team 1"}
                  </div>

                  <span className="vs">
                    VS
                  </span>

                  <div>
                    {match.teams?.[1]?.name || "Team 2"}
                  </div>

                </div>


                {/* Result */}
                <div className="match-result">

                  <span className="result-label">
                    RESULT
                  </span>

                  <strong>
                    {getResultText(match)}
                  </strong>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* Error Message */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* System Status */}
      {/* <section className="system-status">

        <div>
          <h3>
            System Status
          </h3>

          <p>
            CricketIQ backend connection
          </p>
        </div>

        <div className="status-indicator">

          <span
            className={`status-dot ${
              serverStatus === "CricketIQ API is running"
                ? ""
                : "offline"
            }`}
          ></span>

          <span>
            {serverStatus || "Checking backend..."}
          </span>

        </div>

      </section> */}


      {/* Top Performers */}
<section className="dashboard-section">
  <div className="section-header">
    <div>
      <p className="section-label">Performance by players</p>
      <h2>Top Batters</h2>
    </div>
  </div>

  <div className="performers-grid">
    {topPerformers.length > 0 ? (
      topPerformers.map((player, index) => (
        <div className="performer-card" key={player._id || index}>
          <div className="performer-rank">
            #{index + 1}
          </div>

          <PlayerAvatar
            name={player.name || player.playerName || "Unknown Player"}
            imageUrl={player.image}
            size="medium"
          />

          <div className="performer-info">
            <h3>
              {player.name || player.playerName || "Unknown Player"}
            </h3>

            <p>
              {player.runs !== undefined
                ? `${player.runs} runs`
                : player.stat || "Performance data"}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p>No top performer data available.</p>
    )}
  </div>
</section>

<section className="dashboard-section">
  <div className="section-header">
    <div>
      <p className="section-label"></p>
      <h2>Top Bowlers</h2>
    </div>
  </div>

  <div className="performers-grid">
    {topBowlers.length > 0 ? (
      topBowlers.map((bowler, index) => (
        <div className="performer-card" key={bowler.playerId || index}>
          <div className="performer-rank">#{index + 1}</div>
          <PlayerAvatar
            name={bowler.name || "Unknown Player"}
            imageUrl={bowler.image}
            size="medium"
          />
          <div className="performer-info">
            <h3>{bowler.name || "Unknown Player"}</h3>
            <p>
              {bowler.wickets ?? 0} wickets · {bowler.runsConceded ?? 0} runs · Econ {bowler.economy ?? 0}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p>No top bowler data available.</p>
    )}
  </div>
</section>


<footer className="app-footer">
  <div className="footer-brand">
    <h3>🏏 CricketIQ</h3>
    <p>Cricket intelligence powered by data and AI.</p>
  </div>

  <div className="footer-links">
    <button onClick={() => setActivePage("Dashboard")}>
      Dashboard
    </button>

    <button onClick={() => {
      setSelectedPlayerId(null);
      setSelectedPlayer(null);
      setActivePage("Players");
    }}>
      Players
    </button>

    <button onClick={() => {
      setSelectedMatch(null);
      setActivePage("Matches");
    }}>
      Matches
    </button>

    <button onClick={() => setActivePage("AI Insights")}>
      AI Insights
    </button>
  </div>

  <div className="footer-bottom">
    © 2026 CricketIQ. Built for cricket enthusiasts.
  </div>
</footer>


    </div>
  );
}


export default Dashboard;

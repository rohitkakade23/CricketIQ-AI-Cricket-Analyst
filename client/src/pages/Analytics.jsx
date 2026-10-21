import { useEffect, useState } from "react";
import {
  getPlayers,
  getMatches,
  getTeams,
  getTopPerformers,
  getTopBowlers,
} from "../services/dashboardApi";
import "./Analytics.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Analytics() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [bowlers, setBowlers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
  try {
    setLoading(true);
    setError("");

   const [playersData, matchesData, teamsData, performersData, bowlersData] =
  await Promise.all([
    getPlayers(),
    getMatches(),
    getTeams(),
    getTopPerformers(),
    getTopBowlers(),
  ]);

  if (
  playersData.success === false ||
  matchesData.success === false ||
  teamsData.success === false ||
  performersData.success === false ||
  bowlersData.success === false
) {
  throw new Error("Failed to load analytics data");
}

    setPlayers(playersData.players || []);
    setMatches(matchesData.matches || []);
    setTeams(teamsData.teams || []);
    setPerformers(performersData.performers || []);
    setBowlers(bowlersData.bowlers || []);
  } catch (error) {
    console.error("Analytics loading error:", error);
    setError("Unable to load analytics data. Please try again.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadAnalytics();
}, []);

  return (
    <div className="analytics-page">

      {/* <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Explore cricket performance and statistics</p>
        </div>
      </div> */}

      {loading && (
  <div className="analytics-state">
    <p>Loading analytics...</p>
  </div>
)}

{!loading && error && (
  <div className="analytics-state analytics-error">
    <h3>Unable to load analytics</h3>
    <p>{error}</p>
    <button onClick={loadAnalytics}>Try Again</button>
  </div>
)}

{!loading && !error && (
  <div className="analytics-content">

    {/* Overview cards */}
    <div className="analytics-overview">
      <div className="analytics-stat-card">
        <span>Total Players</span>
        <h2>{players.length}</h2>
        <p>Players in the database</p>
      </div>

      <div className="analytics-stat-card">
        <span>Total Matches</span>
        <h2>{matches.length}</h2>
        <p>Matches in the database</p>
      </div>

      <div className="analytics-stat-card">
        <span>Total Teams</span>
        <h2>{teams.length}</h2>
        <p>Teams in the database</p>
      </div>
    </div>

    {/* Batting Performance Chart */}
<div className="analytics-chart-card">
  <div className="analytics-section-header">
    <div>
      <h2>Top Batters by Runs</h2>
      <p>Comparison of runs scored by the top five batters</p>
    </div>
  </div>

  {performers.length === 0 ? (
    <div className="analytics-empty">
      <p>No batting data available to display.</p>
    </div>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={performers}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#30394b"
        />

        <XAxis
          dataKey="name"
          stroke="#aab4c5"
          tick={{ fontSize: 12 }}
        />

        <YAxis
          stroke="#aab4c5"
          allowDecimals={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#151c2c",
            border: "1px solid #30394b",
            borderRadius: "8px",
            color: "#ffffff",
          }}
        />

        <Bar
          dataKey="runs"
          name="Runs"
          fill="#38bdf8"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

{/* Bowling Performance Chart */}
<div className="analytics-chart-card">
  <div className="analytics-section-header">
    <div>
      <h2>Top Bowlers by Wickets</h2>
      <p>Comparison of wickets taken by the top bowlers</p>
    </div>
  </div>

  {bowlers.length === 0 ? (
    <div className="analytics-empty">
      <p>No bowling data available to display.</p>
    </div>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={bowlers}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#30394b" />

        <XAxis
          dataKey="name"
          stroke="#aab4c5"
          tick={{ fontSize: 12 }}
        />

        <YAxis stroke="#aab4c5" allowDecimals={false} />

        <Tooltip
          contentStyle={{
            backgroundColor: "#151c2c",
            border: "1px solid #30394b",
            borderRadius: "8px",
            color: "#ffffff",
          }}
        />

        <Bar
          dataKey="wickets"
          name="Wickets"
          fill="#a78bfa"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

    {/* Batting Leaders */}
    <div className="analytics-leaders">
      <div className="analytics-section-header">
        <div>
          <h2>Batting Leaders</h2>
          <p>Top 5 players ranked by total runs</p>
        </div>
      </div>

      {performers.length === 0 ? (
        <div className="analytics-empty">
          <p>No batting performance data available.</p>
        </div>
      ) : (
        <div className="analytics-leaders-list">
          {performers.map((player, index) => (
            <div
              className="analytics-leader-card"
              key={player.playerId || index}
            >
              <div className="analytics-leader-rank">
                {index + 1}
              </div>

              <div className="analytics-leader-info">
                <h3>{player.name}</h3>
                <p>
                  {player.balls} balls · {player.fours} fours ·{" "}
                  {player.sixes} sixes
                </p>
              </div>

              <div className="analytics-leader-runs">
                <strong>{player.runs}</strong>
                <span>Runs</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>


     {/* Bowling Leaders */}
    <div className="analytics-leaders">
      <div className="analytics-section-header">
        <div>
          <h2>Bowling Leaders</h2>
          <p>Top 5 bowlers ranked by total wickets</p>
        </div>
      </div>

      {bowlers.length === 0 ? (
        <div className="analytics-empty">
          <p>No bowling performance data available.</p>
        </div>
      ) : (
        <div className="analytics-leaders-list">
          {bowlers.map((bowler, index) => (
            <div
              className="analytics-leader-card"
              key={bowler.playerId || index}
            >
              <div className="analytics-leader-rank">
                {index + 1}
              </div>

              <div className="analytics-leader-info">
                <h3>{bowler.name}</h3>
                  <p>
                   {bowler.overs} overs · {bowler.runsConceded} runs conceded
                   {" · "}
                   Economy: {bowler.economy}
                  </p>
              </div>

              <div className="analytics-leader-runs">
                <strong>{bowler.wickets}</strong>
                <span>Wickets</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>


  </div>
)}

    </div>
  );
}

export default Analytics;
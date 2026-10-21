import { useEffect, useState } from "react";
import { getMatches } from "../services/dashboardApi";
import "./Matches.css";

function Matches({setSelectedMatch}) {
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMatches();

        console.log("MATCHES RESPONSE:", data);
        console.log("FIRST MATCH:", data.matches?.[0]);

        setMatches(data.matches ?? []);
      } catch (error) {
        console.error("Matches loading error:", error);
        setError("Unable to load matches");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);


  const filteredMatches = matches.filter((match) => {
  const searchText = search.toLowerCase();

  const team1 = match.teams?.[0]?.name?.toLowerCase() || "";
  const team2 = match.teams?.[1]?.name?.toLowerCase() || "";
  const competition = match.competition?.toLowerCase() || "";
  const venue = match.venue?.toLowerCase() || "";
  const season = match.season?.toString().toLowerCase() || "";

  const matchesSearch =
    team1.includes(searchText) ||
    team2.includes(searchText) ||
    competition.includes(searchText) ||
    venue.includes(searchText) ||
    season.includes(searchText);

  const matchesFormat =
    formatFilter === "All" ||
    match.format === formatFilter;

  return matchesSearch && matchesFormat;
});

  return (
    <div>
      <p>MATCH ANALYTICS</p>
      <h1>Matches</h1>
      <input
       className="matches-search"
       type="text"
       placeholder="Search matches..."
       value={search}
       onChange={(e) => setSearch(e.target.value)}
     />

     <select
  className="matches-format-filter"
  value={formatFilter}
  onChange={(e) => setFormatFilter(e.target.value)}
>
  <option value="All">All Formats</option>
  <option value="T20">T20</option>
  <option value="T20I">T20I</option>
  <option value="ODI">ODI</option>
  <option value="Test">Test</option>
  <option value="Other">Other</option>
</select>

     {loading && (
  <div className="matches-state">
    <div className="matches-loader"></div>
    <p>Loading matches...</p>
  </div>
)}

{error && (
  <div className="matches-error">
    <h3>Unable to load matches</h3>
    <p>{error}</p>
    <button
      className="matches-retry-button"
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  </div>
)}

      {!loading && !error && (
  <div className="matches-list">
    {filteredMatches.map((match) => (
      <div className="match-card" key={match._id}>
        <div className="match-card-top">
          <span>{match.competition}</span>
          <span>{match.format}</span>
        </div>

        <div className="match-teams">
          <strong>{match.teams?.[0]?.name || "Team 1"}</strong>
          <span>VS</span>
          <strong>{match.teams?.[1]?.name || "Team 2"}</strong>
        </div>

        <div className="match-card-info">
          <span>
            {match.date
              ? new Date(match.date).toLocaleDateString()
              : "Date unavailable"}
          </span>

          <span>{match.venue || "Venue unavailable"}</span>

          <span>{match.season || "Season unavailable"}</span>
        </div>

      <button
  className="match-view-button"
  onClick={() => setSelectedMatch(match)}
>
  View Match →
</button>


      </div>
    ))}

       {filteredMatches.length === 0 && (
      <div className="matches-empty">
        <h3>No matches found</h3>
        <p>
          Try a different search term or format.
        </p>
      </div>
    )}


  </div>
)}
    </div>
  );
}

export default Matches;
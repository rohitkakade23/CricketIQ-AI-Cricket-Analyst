import { useEffect, useMemo, useState } from "react";
import { getTeams } from "../services/dashboardApi";
import "./Teams.css";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeams();

      if (!data.success) {
        throw new Error(data.message || "Failed to load teams");
      }

      setTeams(data.teams || []);
    } catch (error) {
      console.error("Teams loading error:", error);
      setError("Unable to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return teams;

    return teams.filter((team) =>
      `${team.name} ${team.country}`.toLowerCase().includes(query)
    );
  }, [teams, search]);

  return (
    <div className="teams-page">
      <div className="teams-page-header">
        <div>
          <h1>Teams</h1>
          <p>Explore cricket teams and their details</p>
        </div>

        <div className="teams-total">
          <span>Total Teams</span>
          <strong>{teams.length}</strong>
        </div>
      </div>

      <div className="teams-toolbar">
        <input
          type="search"
          placeholder="Search by team or country..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search teams"
        />
      </div>

      {loading && (
        <div className="teams-state">
          <div className="teams-loader"></div>
          <p>Loading teams...</p>
        </div>
      )}

      {!loading && error && (
        <div className="teams-state teams-error">
          <h3>Unable to load teams</h3>
          <p>{error}</p>

          <button onClick={loadTeams}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredTeams.length === 0 && (
        <div className="teams-state">
          <h3>
            {teams.length === 0
              ? "No teams available"
              : "No teams found"}
          </h3>

          <p>
            {teams.length === 0
              ? "Teams will appear here once they are added."
              : "Try another team name or country."}
          </p>
        </div>
      )}

      {!loading && !error && filteredTeams.length > 0 && (
        <div className="teams-grid">
          {filteredTeams.map((team) => (
            <article className="team-card" key={team._id}>
              <div className="team-logo">
                {team.logo ? (
                  <img src={team.logo} alt={`${team.name} logo`} />
                ) : (
                  <span>
                    {team.name?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="team-info">
                <h3>{team.name}</h3>
                <p>{team.country}</p>
              </div>

              <span className="team-card-label">
                Cricket Team
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
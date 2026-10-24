// function Navbar({ activePage, serverStatus }) {
//   return (
//     <header className="top-header">

//       <div className="page-heading">

//         <h1>
//           {activePage === "Dashboard"
//             ? "Cricket Intelligence"
//             : activePage}
//         </h1>

//         <p>
//           {activePage === "Dashboard"
//             ? "AI-powered cricket analytics platform"
//             : `Explore ${activePage.toLowerCase()} and cricket intelligence`}
//         </p>

//       </div>


//       <div className="header-actions">

//         {/* Search */}
//         <div className="search-box">
//           <span>⌕</span>

//           <input
//             type="text"
//             placeholder="Search about cricket..."
//           />
//         </div>


//         {/* Backend Status */}
//         {/* <div className="backend-status">

//           <span
//             className={`status-dot ${
//               serverStatus === "CricketIQ API is running"
//                 ? ""
//                 : "offline"
//             }`}
//           ></span>

//           {serverStatus}

//         </div> */}

//       </div>

//     </header>
//   );
// }

// export default Navbar;

import { useState } from "react";

function Navbar({
  activePage,
  searchPlayers = [],
  searchMatches = [],
  searchTeams = [],
  onSelectPlayer,
  onSelectMatch,
  onSelectTeam,
}) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const query = search.trim().toLowerCase();

  const players = query
    ? searchPlayers
        .filter((player) =>
          player.name?.toLowerCase().includes(query)
        )
        .slice(0, 5)
    : [];

  const matches = query
    ? searchMatches
        .filter((match) => {
          const team1 = match.teams?.[0]?.name || "";
          const team2 = match.teams?.[1]?.name || "";

          return `${team1} ${team2} ${match.competition || ""} ${
            match.venue || ""
          } ${match.season || ""}`
            .toLowerCase()
            .includes(query);
        })
        .slice(0, 5)
    : [];

  const teams = query
    ? searchTeams
        .filter((team) =>
          `${team.name || ""} ${team.country || ""}`
            .toLowerCase()
            .includes(query)
        )
        .slice(0, 5)
    : [];

  const hasResults =
    players.length > 0 ||
    matches.length > 0 ||
    teams.length > 0;

  const handleSelect = (callback, item) => {
    callback(item);
    setSearch("");
    setShowResults(false);
  };

  return (
    <header className="top-header">
      <div className="page-heading">
        <h1>
          {activePage === "Dashboard"
            ? "Cricket Intelligence"
            : activePage}
        </h1>

        <p>
          {activePage === "Dashboard"
            ? "AI-powered cricket analytics platform"
            : `Explore ${activePage.toLowerCase()} and cricket intelligence`}
        </p>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search players, matches, teams..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setShowResults(false);
              }
            }}
            aria-label="Search players, matches, and teams"
            autoComplete="off"
          />

          {showResults && query && (
            <div className="search-results">
              {!hasResults ? (
                <p className="search-no-results">
                  No results found for "{search.trim()}"
                </p>
              ) : (
                <>
                  {players.length > 0 && (
                    <div className="search-result-group">
                      <h4>Players</h4>

                      {players.map((player) => (
                        <button
                          type="button"
                          className="search-result-item"
                          key={player._id}
                          onClick={() =>
                            handleSelect(onSelectPlayer, player)
                          }
                        >
                          🏏 {player.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {matches.length > 0 && (
                    <div className="search-result-group">
                      <h4>Matches</h4>

                      {matches.map((match) => (
                        <button
                          type="button"
                          className="search-result-item"
                          key={match._id}
                          onClick={() =>
                            handleSelect(onSelectMatch, match)
                          }
                        >
                          ⚔️{" "}
                          {match.teams?.[0]?.name || "Team 1"}
                          {" vs "}
                          {match.teams?.[1]?.name || "Team 2"}
                        </button>
                      ))}
                    </div>
                  )}

                  {teams.length > 0 && (
                    <div className="search-result-group">
                      <h4>Teams</h4>

                      {teams.map((team) => (
                        <button
                          type="button"
                          className="search-result-item"
                          key={team._id}
                          onClick={() =>
                            handleSelect(onSelectTeam, team)
                          }
                        >
                          🛡️ {team.name}
                          {team.country ? ` · ${team.country}` : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

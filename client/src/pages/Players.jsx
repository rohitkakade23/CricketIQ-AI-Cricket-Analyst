import { useEffect, useState } from "react";
import { getPlayers } from "../services/dashboardApi";
import PlayerAvatar from "../components/PlayerAvatar";
import "./Players.css";

function Players({setSelectedPlayerId,setSelectedPlayer}) {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPlayers();

        setPlayers(data.players ?? []);
      } catch (error) {
        console.error("Players loading error:", error);
        setError("Unable to load players");
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  // console.log("PLAYERS DATA:", players);
  const filteredPlayers = players.filter((player) =>
  player.name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div>
      <p>PLAYER ANALYTICS</p>
      <h1>Players</h1>
      <input
      className="players-search"
      type="text"
      placeholder="Search players..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

      {loading && (
        <div className="players-state">
         <div className="players-loader"></div>
         <p>Loading players...</p>
       </div>
      )}

      {error && (
  <div className="players-error">
    <h3>Unable to load players</h3>
    <p>{error}</p>
    <button
      className="players-retry-button"
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  </div>
)}

      {!loading && !error && (
     <div className="players-grid">
           {filteredPlayers.map((player) => (
           <div className="player-card" key={player._id}>
           <PlayerAvatar
             name={player.name}
             size="medium"
             className="player-card-avatar"
           />
           <div className="player-card-content">
            <p className="player-card-label">PLAYER</p>

          <h3>{player.name}</h3>

          <button
          className="player-view-button"
          onClick={() => {
          setSelectedPlayerId(player._id);
          setSelectedPlayer(player);
           }}
          >
          View Profile →
          </button>
         </div>
       </div>
       ))}

     {filteredPlayers.length === 0 && !loading && !error && (
  <div className="players-empty">
    <h3>No players found</h3>
    <p>
      Try another player name or clear your search.
    </p>
  </div>
)}

    </div>

      )}
    </div>
  );
}

export default Players;

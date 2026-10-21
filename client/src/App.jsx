import { useEffect, useState } from "react";
import { checkServer } from "./services/api";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Analytics from "./pages/Analytics";
import PlayerProfile from "./pages/PlayerProfile";
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";
import Matchup from "./pages/Matchup";
import AIInsights from "./pages/AIInsights";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { getPlayers, getMatches, getTeams } from "./services/dashboardApi";
import "./App.css";

function App() {
  const [serverStatus, setServerStatus] = useState(
    "Checking backend..."
  );

  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchPlayers, setSearchPlayers] = useState([]);
  const [searchMatches, setSearchMatches] = useState([]);
  const [searchTeams, setSearchTeams] = useState([]);

  useEffect(() => {
    const getServerStatus = async () => {
      try {
        const data = await checkServer();
        setServerStatus(data.message);
      } catch (error) {
        setServerStatus("Backend connection failed");
      }
    };

    getServerStatus();
  }, []);

  useEffect(() => {
  const loadSearchData = async () => {
    try {
      const [playersData, matchesData, teamsData] = await Promise.all([
        getPlayers(),
        getMatches(),
        getTeams(),
      ]);

      setSearchPlayers(playersData.players ?? []);
      setSearchMatches(matchesData.matches ?? []);
      setSearchTeams(teamsData.teams ?? []);
    } catch (error) {
      console.error("Navbar search data loading error:", error);
    }
  };

  loadSearchData();
}, []);

  return (
    <div className="app">
      <Sidebar
      activePage={activePage}
      setActivePage={setActivePage}
      />


      {/* Main Content */}
      <main className="main-content">

        <Navbar
  activePage={activePage}
  serverStatus={serverStatus}
  searchPlayers={searchPlayers}
  searchMatches={searchMatches}
  searchTeams={searchTeams}
  onSelectPlayer={(player) => {
    setActivePage("Players");
    setSelectedPlayerId(player._id);
    setSelectedPlayer(player);
  }}
  onSelectMatch={(match) => {
    setActivePage("Matches");
    setSelectedMatch(match);
  }}
  onSelectTeam={() => {
    setActivePage("Teams");
  }}
/>

      {/* Page Content */}
{activePage === "Dashboard" ? (
  <Dashboard serverStatus={serverStatus} />
) : activePage === "Players" ? (
  selectedPlayerId ? (
    <PlayerProfile
      playerId={selectedPlayerId}
      player={selectedPlayer}
      onBack={() => {
        setSelectedPlayerId(null);
        setSelectedPlayer(null);
      }}
    />
  ) : (
    <Players
      setSelectedPlayerId={setSelectedPlayerId}
      setSelectedPlayer={setSelectedPlayer}
    />
  )
) : activePage === "Matches" ? (
  selectedMatch ? (
    <MatchDetails
      matchId={selectedMatch?._id}
      onBack={() => {
        setSelectedMatch(null);
      }}
    />
  ) : (
    <Matches setSelectedMatch={setSelectedMatch} />
  )
) : activePage === "Teams" ? (
  <Teams />
) : activePage === "Analytics" ? (
  <Analytics />
) : activePage === "Matchups" ? (
  <Matchup />
) : activePage === "AI Insights" ? (
  <AIInsights />
) : (
  <section className="placeholder-page">
    <span className="eyebrow">CRICKETIQ</span>
    <h2>{activePage}</h2>
    <p>
      The {activePage} module will be built in the next stages.
    </p>
  </section>
)}

      </main>

    </div>
  );
}

export default App;

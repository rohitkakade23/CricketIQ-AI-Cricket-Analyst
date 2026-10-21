function Sidebar({ activePage, setActivePage }) {
  const pages = [
    "Dashboard",
    "Players",
    "Teams",
    "Matches",
    "Analytics",
    "Matchups",
    "AI Insights",
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        🏏 <span>CricketIQ</span>
      </div>

      <nav>
        {pages.map((item) => (
          <div
            key={item}
            className={`nav-item ${
              activePage === item ? "active" : ""
            }`}
            onClick={() => setActivePage(item)}
          >
            {item}
          </div>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;
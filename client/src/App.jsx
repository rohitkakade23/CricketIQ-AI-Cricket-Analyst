import { useEffect, useState } from "react";
import { checkServer } from "./services/api";

function App() {
  const [serverStatus, setServerStatus] = useState("");

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

  return (
    <div>
      <h1>CricketIQ 🏏</h1>

      <p>AI-powered cricket intelligence platform</p>

      <h2>System Status</h2>

      <p>{serverStatus}</p>
    </div>
  );
}

export default App;

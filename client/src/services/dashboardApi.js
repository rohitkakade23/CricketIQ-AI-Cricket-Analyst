const API_URL = "http://localhost:8000/api";

export const getPlayers = async () => {
  const response = await fetch(`${API_URL}/players`);

  if (!response.ok) {
    throw new Error("Failed to fetch players");
  }

  return response.json();
};

export const getMatches = async () => {
  const response = await fetch(`${API_URL}/matches`);

  if (!response.ok) {
    throw new Error("Failed to fetch matches");
  }

  return response.json();
};

export const getTeams = async () => {
  const response = await fetch(`${API_URL}/teams`);

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  return response.json();
};

export const getMatchById = async (matchId) => {
  const response = await fetch(`${API_URL}/matches/${matchId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch match");
  }

  return response.json();
};

export const getTopPerformers = async () => {
  const response = await fetch(`${API_URL}/players/top-performers`);

  if (!response.ok) {
    throw new Error("Failed to fetch top performers");
  }

  return response.json();
};

export const getTopBowlers = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/players/top-bowlers"
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching top bowlers:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAIPlayerInsights = async (playerId) => {
  const response = await fetch(
    `${API_URL}/players/${playerId}/ai-insights`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch AI insights");
  }

  return response.json();
};

export const getPlayerPerformance = async (playerId) => {
  const response = await fetch(
    `${API_URL}/players/${playerId}/performance`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch player performance");
  }

  return response.json();
};

export const getPlayerPhaseAnalysis = async (playerId) => {
  const response = await fetch(
    `${API_URL}/players/${playerId}/phase-analysis`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch player phase analysis");
  }

  return response.json();
};

export const getPlayerBowlingPhaseAnalysis = async (playerId) => {
  const response = await fetch(
    `${API_URL}/players/${playerId}/bowling-phase-analysis`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch player bowling phase analysis");
  }

  return response.json();
};

export const getMatchAnalytics = async (matchId) => {
  const response = await fetch(
    `${API_URL}/matches/${matchId}/analytics`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch match analytics");
  }

  return response.json();
};

export const getAIMatchSummary = async (matchId) => {
  const response = await fetch(
    `${API_URL}/matches/${matchId}/ai-summary`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch AI match summary");
  }

  return response.json();
};

export const getMatchupAnalytics = async (batterId, bowlerId) => {
  const response = await fetch(
    `${API_URL}/players/matchup/${batterId}/${bowlerId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch matchup analytics");
  }

  return response.json();
};

export const getMatchupPhaseAnalysis = async (batterId, bowlerId) => {
  const response = await fetch(
    `${API_URL}/players/matchup/${batterId}/${bowlerId}/phase-analysis`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch matchup phase analysis");
  }

  return response.json();
};

export const getAIMatchupInsights = async (batterId, bowlerId) => {
  const response = await fetch(
    `${API_URL}/players/matchup/${batterId}/${bowlerId}/ai`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch AI matchup insights");
  }

  return response.json();
};

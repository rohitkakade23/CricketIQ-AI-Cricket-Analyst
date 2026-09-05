const API_URL = "http://localhost:8000";

export const checkServer = async () => {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Server request failed");
  }

  return response.json();
};
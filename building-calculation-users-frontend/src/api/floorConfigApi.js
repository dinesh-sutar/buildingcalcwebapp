const API_BASE_URL = "http://localhost:8080";

export async function getFloorConfigs() {
  const response = await fetch(
    `${API_BASE_URL}/api/building-floor-configs`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load floor configurations"
    );
  }

  return response.json();
}
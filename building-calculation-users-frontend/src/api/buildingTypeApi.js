const API_BASE_URL = "http://localhost:8080";

export async function getBuildingTypes() {
  const response = await fetch(
    `${API_BASE_URL}/api/building-types`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load building types"
    );
  }

  return response.json();
}
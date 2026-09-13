const API_BASE_URL = "http://localhost:8080";

export async function getFloorings() {
  const response = await fetch(
    `${API_BASE_URL}/api/floorings`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load flooring options"
    );
  }

  return response.json();
}
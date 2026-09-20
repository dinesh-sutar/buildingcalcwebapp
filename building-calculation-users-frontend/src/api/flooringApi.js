const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
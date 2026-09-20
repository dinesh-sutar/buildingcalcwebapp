const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
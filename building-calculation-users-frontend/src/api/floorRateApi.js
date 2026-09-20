const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getFloorRates() {
  const response = await fetch(
    `${API_BASE_URL}/api/building-floor-rates`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load floor rates"
    );
  }

  return response.json();
}

export async function getFloorTypes() {
  const response = await fetch(
    `${API_BASE_URL}/api/floor-types`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load floor types"
    );
  }

  return response.json();
}
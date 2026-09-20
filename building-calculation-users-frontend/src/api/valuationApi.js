const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function calculateValuation(
  calculationRequest
) {
  const response = await fetch(
    `${API_BASE_URL}/api/valuation`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(
        calculationRequest
      )
    }
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to calculate valuation"
    );
  }

  return response.json();
}
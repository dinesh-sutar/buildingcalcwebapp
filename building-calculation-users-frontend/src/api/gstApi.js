const API_BASE_URL = "http://localhost:8080";

export async function getGstOptions() {
  const response = await fetch(
    `${API_BASE_URL}/api/gst-options`
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || "Failed to fetch GST options"
    );
  }

  return response.json();
}
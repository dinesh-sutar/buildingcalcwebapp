const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VISITOR_ID_KEY = "visitorId";

export async function trackVisitor() {
  try {
    const visitorId =
      localStorage.getItem(VISITOR_ID_KEY);

    const headers = {
      "Content-Type": "application/json",
    };

    if (visitorId) {
      headers["X-Visitor-Id"] = visitorId;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/analytics/visitor`,
      {
        method: "POST",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to track visitor"
      );
    }

    const data = await response.json();

    if (data.visitorId) {
      localStorage.setItem(
        VISITOR_ID_KEY,
        data.visitorId
      );
    }

    return data.visitorId;

  } catch (error) {
    console.error(
      "Visitor tracking failed:",
      error
    );
  }
}
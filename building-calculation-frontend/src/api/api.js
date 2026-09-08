const API_BASE_URL = "http://localhost:8080/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();
      message =
        error.message ||
        error.error ||
        JSON.stringify(error);
    } catch {
      // response wasn't JSON
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (url) =>
    request(url),

  post: (url, data) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (url, data) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (url) =>
    request(url, {
      method: "DELETE",
    }),
};

export default api;
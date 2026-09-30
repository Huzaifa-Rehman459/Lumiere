const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    "VITE_API_URL is not set. Create a .env file with VITE_API_URL=http://localhost:5000/api and restart the dev server."
  );
}

/**
 * Central function every page/component uses to talk to the backend.
 *
 * @param {string} path   - e.g. "/products" or "/auth/login"
 * @param {object} opts
 *   method: "GET" | "POST" | "PUT" | "DELETE"  (default "GET")
 */
export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  let payload = body;

  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = localStorage.getItem("token");
    if (!token) {
      const err = new Error("Not logged in");
      err.status = 401;
      throw err;
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch (networkErr) {
    // fetch itself throws for network failures (server down, CORS block, no internet)
    const err = new Error("Could not reach the server. Check your connection and try again.");
    err.status = 0;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Expired/invalid token on a route that needed one: clear it
    if (res.status === 401 && auth) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }

  return data;
}
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    "VITE_API_URL is not set. Create a .env file with VITE_API_URL=http://localhost:5000/api and restart the dev server."
  );
}

// Different key names from the storefront, so the two apps can never
// overwrite each other's login if they ever share a domain.
const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";
export const SESSION_EXPIRED_EVENT = "admin-session-expired";

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export function saveAdminSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  let payload = body;

  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  // FormData sets its own Content-Type with a boundary. Never set it manually.

  if (auth) {
    const token = getAdminToken();
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
  } catch {
    const err = new Error("Could not reach the server. Check your connection and try again.");
    err.status = 0;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Token expired or invalid: wipe it and tell the app, so it can send the
    // admin back to the login page instead of showing a broken screen.
    if (res.status === 401 && auth) {
      clearAdminSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }

  return data;
}
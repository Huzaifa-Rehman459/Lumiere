import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  apiRequest,
  clearAdminSession,
  getAdminToken,
  getStoredAdmin,
  saveAdminSession,
  SESSION_EXPIRED_EVENT,
} from "../api/client";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // Start logged in only if a token exists. It gets verified with the server below.
  const [admin, setAdmin] = useState(() =>
    getAdminToken() ? getStoredAdmin() : null,
  );
  const [checking, setChecking] = useState(() => Boolean(getAdminToken()));
  const [authNotice, setAuthNotice] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((message, type = "success") => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = window.setTimeout(
      () => setToast(null),
      type === "error" ? 4500 : 2300,
    );
  }, []);

  const endSession = useCallback((notice = "") => {
    clearAdminSession();
    setAdmin(null);
    setAuthNotice(notice);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setAdmin(null);
      setAuthNotice("Your session expired. Please sign in again.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  useEffect(() => {
    if (!getAdminToken()) return;
    let cancelled = false;

    apiRequest("/auth/me")
      .then(({ user }) => {
        if (cancelled) return;
        if (user.role !== "admin") {
          endSession("Your account no longer has admin access.");
        } else {
          saveAdminSession(getAdminToken(), user);
          setAdmin(user);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endSession]);

  // Throws on failure. The Login page shows the message.
  const login = useCallback(async (email, password) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });

    if (res.user.role !== "admin") {
      throw new Error("This account does not have admin access.");
    }

    saveAdminSession(res.token, res.user);
    setAuthNotice("");
    setAdmin(res.user);
  }, []);

  const logout = useCallback(() => endSession(), [endSession]);

  const value = useMemo(
    () => ({
      notify,
      toast,
      admin,
      login,
      logout,
      checking,
      authNotice,
      clearAuthNotice: () => setAuthNotice(""),
      isAuthenticated: Boolean(admin),
    }),
    [notify, toast, admin, login, logout, checking, authNotice],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
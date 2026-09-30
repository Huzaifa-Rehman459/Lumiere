import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type }
  const timer = useRef(null);

  const notify = useCallback((message, type = "success") => {
    window.clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = window.setTimeout(
      () => setToast(null),
      type === "error" ? 3800 : 2200
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast, notify }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
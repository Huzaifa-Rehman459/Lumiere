import { CheckCircle2, AlertCircle } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import "./Toast.css";

export default function Toast() {
  const { toast } = useAdmin();
  if (!toast) return null;

  const isError = toast.type === "error";
  return (
    <div
      className={`app-toast ${isError ? "app-toast--error" : ""}`}
      role={isError ? "alert" : "status"}
    >
      {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {toast.message}
    </div>
  );
}
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import "./Toast.css";

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  const isError = toast.type === "error";
  return (
    <div
      className={`store-toast ${isError ? "store-toast--error" : ""}`}
      role={isError ? "alert" : "status"}
    >
      {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {toast.message}
    </div>
  );
}
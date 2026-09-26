import { CheckCircle2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import "./Toast.css";
export default function Toast() {
  const { toast } = useAdmin();
  return toast ? (
    <div className="app-toast">
      <CheckCircle2 size={16} />
      {toast}
    </div>
  ) : null;
}

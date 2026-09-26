import { Outlet } from "react-router-dom";
import Topbar from "../Topbar/Topbar";
import Toast from "../Toast/Toast";
import "./AdminLayout.css";
export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <main className="admin-main">
        <Topbar />
        <Outlet />
        <footer className="admin-footer">
          © 2026 Lumière. All rights reserved.
          <span>Privacy Policy　 Terms & Conditions</span>
        </footer>
      </main>
      <Toast />
    </div>
  );
}

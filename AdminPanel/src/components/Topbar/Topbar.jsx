import { useState } from "react";
import { Menu, Search, LogOut } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import Sidebar from "../Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import "./Topbar.css";
export default function Topbar() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAdmin();
  const location = useLocation();
  return (
    <>
      <header className="topbar">
        <button
          className="topbar-icon topbar-menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
        <div className="topbar-search">
          <Search size={17} />
          <input placeholder="Search is available on each list page" readOnly />
        </div>
        <div className="topbar-user">
          <span className="topbar-avatar">{admin?.name?.[0] || "A"}</span>
          <span className="topbar-userinfo">
            <b>{admin?.name}</b>
            <small>{admin?.role}</small>
          </span>
          <button className="topbar-icon" title="Sign out" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <div className="mobile-sidebar-host">
        <Sidebar mobileOpen={open} close={() => setOpen(false)} />
      </div>
    </>
  );
}

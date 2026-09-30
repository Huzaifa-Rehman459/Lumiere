import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Grid2X2,
  ShieldCheck,
  X,
} from "lucide-react";
import "./Sidebar.css";

const links = [
  ["Dashboard", "/", LayoutDashboard],
  ["Products", "/products", ShoppingBag],
  ["Orders", "/orders", ClipboardList],
  ["Categories", "/categories", Grid2X2],
  ["Admin Access", "/admins", ShieldCheck],
];

export default function Sidebar({ mobileOpen, close }) {
  return (
    <>
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          Lumière
          <button className="sidebar-close" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <small className="sidebar-caption">WORKSPACE</small>
        {links.map(([label, path, Icon]) => (
          <NavLink
            end={path === "/"}
            key={path}
            to={path}
            onClick={close}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <div className="sidebar-bottom">
          ✳
          <p>
            Better Fashion
            <br />
            Brighter Tomorrow
          </p>
          <small>Lumière Admin · v1.0</small>
        </div>
      </aside>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="sidebar-scrim"
          onClick={close}
        />
      )}
    </>
  );
}
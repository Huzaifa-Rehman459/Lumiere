import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Grid2X2,
  Star,
  TicketPercent,
  ChartNoAxesCombined,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import "./Sidebar.css";
const links = [
  ["Dashboard", "/", LayoutDashboard],
  ["Products", "/products", ShoppingBag],
  ["Orders", "/orders", ClipboardList],
  ["Customers", "/customers", Users],
  ["Categories", "/categories", Grid2X2],
  ["Reviews", "/reviews", Star],
  ["Coupons", "/coupons", TicketPercent],
  ["Analytics", "/analytics", ChartNoAxesCombined],
  ["Settings", "/settings", Settings],
];
export default function Sidebar({ mobileOpen, close }) {
  const { isSuperAdmin } = useAdmin();
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
        {isSuperAdmin && (
          <NavLink
            to="/admins"
            onClick={close}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <ShieldCheck size={18} />
            Admin Access
          </NavLink>
        )}
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

import { useCallback, useEffect, useMemo, useState } from "react";
import { UserMinus } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { apiRequest } from "../../api/client";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import AdminModal from "../../components/AdminModal/AdminModal";
import { downloadCSV } from "../../utils/adminHelpers";
import "./Admins.css";

export default function Admins() {
  const { admin: self, notify } = useAdmin();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [demotingId, setDemotingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest("/admin/admins");
      setAdmins(data.admins);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createAdmin(form) {
    const res = await apiRequest("/admin/admins", { method: "POST", body: form });
    setAdmins((list) => [...list, res.user]);
    setShowModal(false);
    notify("Admin created");
  }

  async function demote(item) {
    if (
      !window.confirm(
        `Remove admin access from ${item.fullName}? They'll become a regular customer account.`,
      )
    ) {
      return;
    }
    setDemotingId(item.id);
    try {
      await apiRequest(`/admin/users/${item.id}/role`, {
        method: "PUT",
        body: { role: "user" },
      });
      setAdmins((list) => list.filter((a) => a.id !== item.id));
      notify(`${item.fullName} is no longer an admin`);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setDemotingId(null);
    }
  }

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      admins.filter(
        (a) => !q || `${a.fullName} ${a.email}`.toLowerCase().includes(q),
      ),
    [admins, q],
  );

  const rows = filtered.map((item) => {
    const isSelf = item.id === self?.id;
    return {
      key: item.id,
      cells: [
        <div className="admin-name">
          <span className="admin-avatar">{item.fullName?.[0] ?? "?"}</span>
          <span>
            {item.fullName}
            {isSelf && <span className="admin-you"> (you)</span>}
          </span>
        </div>,
        item.email,
        "Admin",
        <div className="row-actions">
          <button
            title={isSelf ? "You can't remove your own admin access" : "Remove admin access"}
            disabled={isSelf || demotingId === item.id}
            onClick={() => demote(item)}
          >
            <UserMinus size={14} />
          </button>
        </div>,
      ],
    };
  });

  return (
    <PageContent
      title="Admin Access"
      description="Every admin has equal, full access to this dashboard."
    >
      <Panel>
        <Toolbar
          count={admins.length}
          onExport={() =>
            downloadCSV(
              "admins",
              admins.map((a) => ({ name: a.fullName, email: a.email, role: "Admin" })),
            )
          }
          onAdd={() => setShowModal(true)}
          addLabel="Add Admin"
        />
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search admins..."
          />
        </div>

        {loading ? (
          <p className="page-status">Loading admins...</p>
        ) : loadError ? (
          <div className="page-status page-status--error">
            {loadError}
            <button className="btn btn-light" onClick={load}>
              Retry
            </button>
          </div>
        ) : (
          <DataTable columns={["Admin", "Email", "Role", "Actions"]} rows={rows} />
        )}
      </Panel>

      {showModal && (
        <AdminModal onClose={() => setShowModal(false)} onSave={createAdmin} />
      )}
    </PageContent>
  );
}
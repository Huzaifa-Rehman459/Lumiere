import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import EntityModal from "../../components/EntityModal/EntityModal";
import { downloadCSV, makeId } from "../../utils/adminHelpers";
import "./Admins.css";
export default function Admins() {
  const { data, updateCollection, notify, isSuperAdmin } = useAdmin();
  const [modal, setModal] = useState(null);
  if (!isSuperAdmin)
    return (
      <PageContent
        title="Admin Access"
        description="Administrator management is restricted to Super Admin."
      >
        <Panel>
          <p>You do not have permission to view this section.</p>
        </Panel>
      </PageContent>
    );
  function save(form) {
    const old = modal.item;
    const item = {
      ...form,
      id: old?.id ?? makeId(),
      status: old?.status || "Active",
    };
    updateCollection(
      "admins",
      old
        ? data.admins.map((a) => (a.id === old.id ? item : a))
        : [item, ...data.admins],
    );
    setModal(null);
    notify("Admin saved");
  }
  const rows = data.admins.map((a) => ({
    key: a.id,
    cells: [
      a.name,
      a.email,
      a.role,
      <StatusBadge status={a.status} />,
      <button
        className="btn btn-light"
        disabled={a.role === "Super Admin"}
        onClick={() => {
          updateCollection(
            "admins",
            data.admins.map((x) =>
              x.id === a.id
                ? {
                    ...x,
                    status: x.status === "Active" ? "Inactive" : "Active",
                  }
                : x,
            ),
          );
          notify("Admin access updated");
        }}
      >
        {a.status === "Active" ? "Deactivate" : "Activate"}
      </button>,
    ],
  }));
  return (
    <PageContent
      title="Admin Access"
      description="Manage staff accounts and their access status."
    >
      <Panel>
        <Toolbar
          count={data.admins.length}
          onExport={() => downloadCSV("admins", data.admins)}
          onAdd={() => setModal({ item: null })}
          addLabel="Create Admin"
        />
        <DataTable
          columns={["Name", "Email", "Role", "Status", "Action"]}
          rows={rows}
        />
      </Panel>
      {modal && (
        <EntityModal
          type="Admins"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}

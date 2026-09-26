import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import EntityModal from "../../components/EntityModal/EntityModal";
import {
  downloadCSV,
  filterRows,
  makeId,
  money,
} from "../../utils/adminHelpers";
import "./Coupons.css";
export default function Coupons() {
  const { data, updateCollection, notify } = useAdmin();
  const [query, setQuery] = useState(""),
    [modal, setModal] = useState(null);
  const items = filterRows(data.coupons, query);
  function save(form) {
    const old = modal.item;
    let item = { ...form, id: old?.id ?? makeId() };

    item.value = Number(form.value);
    item.uses = old?.uses ?? 0;
    item.status = "Active";
    updateCollection(
      "coupons",
      old
        ? data.coupons.map((x) => (x.id === old.id ? item : x))
        : [item, ...data.coupons],
    );
    setModal(null);
    notify("Saved successfully");
  }
  function remove(item) {
    if (window.confirm("Delete this item?")) {
      updateCollection(
        "coupons",
        data.coupons.filter((x) => x.id !== item.id),
      );
      notify("Deleted");
    }
  }
  const rows = items.map((item) => ({
    key: item.id,
    cells: [
      <b>{item.code}</b>,
      item.type === "Percentage" ? item.value + "%" : money(item.value),
      item.uses,
      item.expiry,
      <span className="status-badge active">{item.status}</span>,
      <div className="row-actions">
        <button onClick={() => setModal({ item })}>
          <Pencil size={14} />
        </button>
        <button onClick={() => remove(item)}>
          <Trash2 size={14} />
        </button>
      </div>,
    ],
  }));
  return (
    <PageContent
      title="Coupons"
      description="Create and manage promotional discount codes."
    >
      <Panel>
        <Toolbar
          count={data.coupons.length}
          onExport={() => downloadCSV("coupons", data.coupons)}
          onAdd={() => setModal({ item: null })}
          addLabel="Create Coupon"
        />
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter coupons..."
          />
        </div>
        <DataTable
          columns={["Code", "Discount", "Uses", "Expiry", "Status", "Actions"]}
          rows={rows}
        />
      </Panel>
      {modal && (
        <EntityModal
          type="Coupons"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}

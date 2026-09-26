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
import "./Customers.css";
export default function Customers() {
  const { data, updateCollection, notify } = useAdmin();
  const [query, setQuery] = useState(""),
    [modal, setModal] = useState(null);
  const items = filterRows(data.customers, query);
  function save(form) {
    const old = modal.item;
    let item = { ...form, id: old?.id ?? makeId() };

    updateCollection(
      "customers",
      old
        ? data.customers.map((x) => (x.id === old.id ? item : x))
        : [item, ...data.customers],
    );
    setModal(null);
    notify("Saved successfully");
  }
  function remove(item) {
    if (window.confirm("Delete this item?")) {
      updateCollection(
        "customers",
        data.customers.filter((x) => x.id !== item.id),
      );
      notify("Deleted");
    }
  }
  const rows = items.map((item) => ({
    key: item.id,
    cells: [<b>{item.name}</b>, item.email, item.orders, money(item.spent)],
  }));
  return (
    <PageContent
      title="Customers"
      description="View customer profiles and purchase history."
    >
      <Panel>
        <Toolbar
          count={data.customers.length}
          onExport={() => downloadCSV("customers", data.customers)}
          onAdd={undefined}
          addLabel="Add New"
        />
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter customers..."
          />
        </div>
        <DataTable
          columns={["Customer", "Email", "Orders", "Total Spent"]}
          rows={rows}
        />
      </Panel>
      {modal && (
        <EntityModal
          type="Customers"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}

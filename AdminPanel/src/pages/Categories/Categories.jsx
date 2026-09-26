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
import "./Categories.css";
export default function Categories() {
  const { data, updateCollection, notify } = useAdmin();
  const [query, setQuery] = useState(""),
    [modal, setModal] = useState(null);
  const items = filterRows(data.categories, query);
  function save(form) {
    const old = modal.item;
    let item = { ...form, id: old?.id ?? makeId() };

    updateCollection(
      "categories",
      old
        ? data.categories.map((x) => (x.id === old.id ? item : x))
        : [item, ...data.categories],
    );
    setModal(null);
    notify("Saved successfully");
  }
  function remove(item) {
    if (window.confirm("Delete this item?")) {
      updateCollection(
        "categories",
        data.categories.filter((x) => x.id !== item.id),
      );
      notify("Deleted");
    }
  }
  const rows = items.map((item) => ({
    key: item.id,
    cells: [
      <b>{item.name}</b>,
      item.description,
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
      title="Categories"
      description="Organize products into storefront collections."
    >
      <Panel>
        <Toolbar
          count={data.categories.length}
          onExport={() => downloadCSV("categories", data.categories)}
          onAdd={() => setModal({ item: null })}
          addLabel="Add Category"
        />
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter categories..."
          />
        </div>
        <DataTable
          columns={["Category", "Description", "Actions"]}
          rows={rows}
        />
      </Panel>
      {modal && (
        <EntityModal
          type="Categories"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}

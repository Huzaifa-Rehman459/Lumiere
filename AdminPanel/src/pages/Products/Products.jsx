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
import "./Products.css";
export default function Products() {
  const { data, updateCollection, notify } = useAdmin();
  const [query, setQuery] = useState(""),
    [modal, setModal] = useState(null);
  const items = filterRows(data.products, query);
  function save(form) {
    const old = modal.item;
    let item = { ...form, id: old?.id ?? makeId() };
    item.price = Number(form.price);
    item.stock = Number(form.stock);
    item.sku = form.sku || `LM-${Date.now().toString().slice(-5)}`;

    updateCollection(
      "products",
      old
        ? data.products.map((x) => (x.id === old.id ? item : x))
        : [item, ...data.products],
    );
    setModal(null);
    notify("Saved successfully");
  }
  function remove(item) {
    if (window.confirm("Delete this item?")) {
      updateCollection(
        "products",
        data.products.filter((x) => x.id !== item.id),
      );
      notify("Deleted");
    }
  }
  const rows = items.map((item) => ({
    key: item.id,
    cells: [
      <>
        <b>{item.name}</b>
      </>,
      item.sku,
      item.category,
      money(item.price),
      item.stock,
      <span
        className={`status-badge ${item.stock === 0 ? "out-of-stock" : item.stock <= 10 ? "low-stock" : "active"}`}
      >
        {item.stock === 0
          ? "Out of stock"
          : item.stock <= 10
            ? "Low stock"
            : "Active"}
      </span>,
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
      title="Products"
      description="Manage your product catalog, pricing and inventory."
    >
      <Panel>
        <Toolbar
          count={data.products.length}
          onExport={() => downloadCSV("products", data.products)}
          onAdd={() => setModal({ item: null })}
          addLabel="Add Product"
        />
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter products..."
          />
        </div>
        <DataTable
          columns={[
            "Product",
            "SKU",
            "Category",
            "Price",
            "Stock",
            "Status",
            "Actions",
          ]}
          rows={rows}
        />
      </Panel>
      {modal && (
        <EntityModal
          type="Products"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}

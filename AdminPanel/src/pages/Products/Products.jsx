import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { apiRequest } from "../../api/client";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import ProductModal from "../../components/ProductModal/ProductModal";
import { downloadCSV, money } from "../../utils/adminHelpers";
import "./Products.css";

const PAGE_SIZE = 10;
const UPLOAD_CHUNK = 5;

function stockStatus(stock) {
  if (stock === 0) return "Out of stock";
  if (stock <= 10) return "Low stock";
  return "Active";
}

export default function Products() {
  const { notify } = useAdmin();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");

  const [modal, setModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      sort: "newest",
    });
    if (search) params.set("search", search);

    try {
      const data = await apiRequest(`/products?${params}`);
      if (id !== requestId.current) return;
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
      setLoadError("");
      // Deleted the last item on the last page? Step back one page.
      if (data.products.length === 0 && data.page > 1) setPage(data.page - 1);
    } catch (err) {
      if (id !== requestId.current) return;
      setLoadError(err.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  // Active categories, for the modal's dropdown
  useEffect(() => {
    apiRequest("/categories")
      .then((data) => setCategories(data.categories))
      .catch((err) => setCategoriesError(err.message));
  }, []);

  // Search waits for a short pause in typing, then goes back to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== search) {
        setSearch(next);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  async function save(payload, newFiles, removedIds) {
    const editing = modal.item;

    const body = { ...payload };
    if (editing && payload.category === editing.category?._id) {
      delete body.category;
    }

    const res = editing
      ? await apiRequest(`/products/${editing._id}`, { method: "PUT", body })
      : await apiRequest("/products", { method: "POST", body });
    const saved = res.product;

    // The product itself is saved. Image trouble is reported separately.
    const problems = [];

    // Delete first, so the server's 6-image limit has room for the new ones
    for (const imageId of removedIds) {
      try {
        await apiRequest(`/products/${saved._id}/images/${imageId}`, {
          method: "DELETE",
        });
      } catch (err) {
        problems.push(`an image could not be removed (${err.message})`);
      }
    }

    for (let i = 0; i < newFiles.length; i += UPLOAD_CHUNK) {
      const form = new FormData();
      newFiles.slice(i, i + UPLOAD_CHUNK).forEach((f) => form.append("images", f));
      try {
        await apiRequest(`/products/${saved._id}/images`, {
          method: "POST",
          body: form,
        });
      } catch (err) {
        problems.push(`image upload failed (${err.message})`);
        break;
      }
    }

    setModal(null);
    // New products sort first, so jump to page 1 to see it
    if (!editing && page !== 1) setPage(1);
    else await load();

    if (problems.length) {
      notify(`Product saved, but ${problems.join("; ")}`, "error");
    } else {
      notify(editing ? "Product updated" : "Product created");
    }
  }

  async function remove(item) {
    if (
      !window.confirm(
        `Delete "${item.name}"? Its photos are deleted too. This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeletingId(item._id);
    try {
      await apiRequest(`/products/${item._id}`, { method: "DELETE" });
      notify("Product deleted");
      await load();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function exportCSV() {
    if (exporting) return;
    setExporting(true);
    try {
      const all = [];
      let p = 1;
      let lastPage = 1;
      do {
        const params = new URLSearchParams({
          page: String(p),
          limit: "50",
          sort: "newest",
        });
        if (search) params.set("search", search);
        const data = await apiRequest(`/products?${params}`);
        all.push(...data.products);
        lastPage = data.pages;
        p += 1;
      } while (p <= lastPage);

      downloadCSV(
        "products",
        all.map((x) => ({
          name: x.name,
          category: x.category?.name ?? "",
          price: x.price,
          stock: x.stock,
          sizes: x.sizes.join(" / "),
          colors: x.colors.map((c) => c.name).join(" / "),
          bestSeller: x.isBestSeller ? "Yes" : "No",
          newArrival: x.isNewArrival ? "Yes" : "No",
          images: x.images.length,
          id: x._id,
        })),
      );
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setExporting(false);
    }
  }

  const rows = products.map((item) => ({
    key: item._id,
    cells: [
      item.images[0]?.url ? (
        <img className="prod-thumb" src={item.images[0].url} alt="" />
      ) : (
        <span className="prod-thumb prod-thumb--empty">{item.name[0]}</span>
      ),
      <div>
        <b>{item.name}</b>
        {item.isBestSeller && <span className="prod-tag">Best seller</span>}
        {item.isNewArrival && <span className="prod-tag">New</span>}
      </div>,
      item.category?.name ?? "—",
      money(item.price),
      item.stock,
      <StatusBadge status={stockStatus(item.stock)} />,
      <div className="row-actions">
        <button title="Edit" onClick={() => setModal({ item })}>
          <Pencil size={14} />
        </button>
        <button
          title="Delete"
          disabled={deletingId === item._id}
          onClick={() => remove(item)}
        >
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
          count={total}
          onExport={exportCSV}
          onAdd={() => setModal({ item: null })}
          addLabel="Add Product"
        />
        <div className="list-search">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by name..."
          />
        </div>

        {loading ? (
          <p className="page-status">Loading products...</p>
        ) : loadError ? (
          <div className="page-status page-status--error">
            {loadError}
            <button className="btn btn-light" onClick={load}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <DataTable
              columns={["Image", "Product", "Category", "Price", "Stock", "Status", "Actions"]}
              rows={rows}
            />
            {pages > 1 && (
              <div className="table-pager">
                <button
                  className="btn btn-light"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {pages}
                </span>
                <button
                  className="btn btn-light"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Panel>

      {modal && (
        <ProductModal
          initial={modal.item}
          categories={categories}
          categoriesError={categoriesError}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}
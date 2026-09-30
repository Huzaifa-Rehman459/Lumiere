import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { apiRequest } from "../../api/client";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import Toolbar from "../../components/Toolbar/Toolbar";
import DataTable from "../../components/DataTable/DataTable";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import CategoryModal from "../../components/CategoryModal/CategoryModal";
import { downloadCSV } from "../../utils/adminHelpers";
import "./Categories.css";

export default function Categories() {
  const { notify } = useAdmin();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest("/categories?all=true");
      setCategories(data.categories);
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

  async function save(form, imageFile, removeImage) {
    const editing = modal.item;
    let saved;

    if (editing) {
      const res = await apiRequest(`/categories/${editing._id}`, {
        method: "PUT",
        body: {
          name: form.name,
          description: form.description,
          isActive: form.isActive,
        },
      });
      saved = res.category;
    } else {
      const res = await apiRequest("/categories", {
        method: "POST",
        body: { name: form.name, description: form.description },
      });
      saved = res.category;
    }

    let imageProblem = "";
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await apiRequest(`/categories/${saved._id}/image`, {
          method: "POST",
          body: fd,
        });
      } else if (removeImage && editing?.image?.url) {
        await apiRequest(`/categories/${saved._id}/image`, { method: "DELETE" });
      }
    } catch (err) {
      imageProblem = err.message;
    }

    setModal(null);
    await load();

    if (imageProblem) {
      notify(`Category saved, but the image failed: ${imageProblem}`, "error");
    } else {
      notify(editing ? "Category updated" : "Category created");
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    setDeletingId(item._id);
    try {
      await apiRequest(`/categories/${item._id}`, { method: "DELETE" });
      setCategories((list) => list.filter((c) => c._id !== item._id));
      notify("Category deleted");
    } catch (err) {
      // e.g. "Cannot delete: 3 product(s) still use this category..."
      notify(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  }

  const q = query.trim().toLowerCase();
  const items = categories.filter(
    (c) =>
      !q || `${c.name} ${c.slug} ${c.description}`.toLowerCase().includes(q),
  );

  const rows = items.map((item) => ({
    key: item._id,
    cells: [
      item.image?.url ? (
        <img className="cat-thumb" src={item.image.url} alt="" />
      ) : (
        <span className="cat-thumb cat-thumb--empty">{item.name[0]}</span>
      ),
      <b>{item.name}</b>,
      item.slug,
      item.description || "—",
      <StatusBadge status={item.isActive ? "Active" : "Hidden"} />,
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
      title="Categories"
      description="Organize products into storefront collections."
    >
      <Panel>
        <Toolbar
          count={categories.length}
          onExport={() =>
            downloadCSV(
              "categories",
              categories.map((c) => ({
                name: c.name,
                slug: c.slug,
                description: c.description,
                status: c.isActive ? "Active" : "Hidden",
                image: c.image?.url || "",
              })),
            )
          }
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

        {loading ? (
          <p className="page-status">Loading categories...</p>
        ) : loadError ? (
          <div className="page-status page-status--error">
            {loadError}
            <button className="btn btn-light" onClick={load}>
              Retry
            </button>
          </div>
        ) : (
          <DataTable
            columns={["Image", "Category", "Slug", "Description", "Status", "Actions"]}
            rows={rows}
          />
        )}
      </Panel>

      {modal && (
        <CategoryModal
          initial={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageContent>
  );
}
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import "../EntityModal/EntityModal.css";
import "./ProductModal.css";

const SIZES = ["XS", "S", "M", "L", "XL"];
const MAX_IMAGES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const COLOR_PRESETS = [
  { name: "Black", hex: "#222222" },
  { name: "Blue", hex: "#3b6fb6" },
  { name: "Pink", hex: "#f4a6b8" },
  { name: "Green", hex: "#6aa57a" },
  { name: "Beige", hex: "#d8c3a5" },
  { name: "Red", hex: "#c0392b" },
];

export default function ProductModal({
  initial,
  categories,
  categoriesError,
  onClose,
  onSave,
}) {
  const editing = Boolean(initial);
  const fileInput = useRef(null);
  const previewUrls = useRef([]);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial ? String(initial.price) : "",
    stock: initial ? String(initial.stock) : "",
    category: initial?.category?._id ?? "",
    isBestSeller: initial?.isBestSeller ?? false,
    isNewArrival: initial?.isNewArrival ?? false,
  });
  const [sizes, setSizes] = useState(initial?.sizes ?? []);
  const [colors, setColors] = useState(
    (initial?.colors ?? []).map((c) => ({ name: c.name, hex: c.hex })),
  );
  const [removedIds, setRemovedIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const setText = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setFlag = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.checked }));

  const options = [...categories];
  if (
    editing &&
    initial.category &&
    !categories.some((c) => c._id === initial.category._id)
  ) {
    options.unshift({
      _id: initial.category._id,
      name: `${initial.category.name} (hidden)`,
    });
  }

  const toggleSize = (size) =>
    setSizes((list) =>
      list.includes(size) ? list.filter((s) => s !== size) : [...list, size],
    );

  const addPreset = (preset) =>
    setColors((list) =>
      list.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())
        ? list
        : [...list, { ...preset }],
    );
  const addCustomColor = () =>
    setColors((list) => [...list, { name: "", hex: "#cccccc" }]);
  const updateColor = (index, patch) =>
    setColors((list) =>
      list.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  const removeColor = (index) =>
    setColors((list) => list.filter((_, i) => i !== index));

  // ----- images -----
  const savedImages = (initial?.images ?? []).filter(
    (img) => !removedIds.includes(img._id),
  );
  const totalImages = savedImages.length + newFiles.length;

  function pickFiles(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;

    let problem = "";
    const accepted = [];
    for (const file of picked) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        problem = `"${file.name}" is not a JPG, PNG or WEBP image.`;
      } else if (file.size > MAX_BYTES) {
        problem = `"${file.name}" is larger than 5 MB.`;
      } else {
        accepted.push(file);
      }
    }

    const room = Math.max(MAX_IMAGES - totalImages, 0);
    if (accepted.length > room) {
      problem = `A product can have at most ${MAX_IMAGES} images.`;
    }

    const added = accepted.slice(0, room).map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.current.push(url);
      return { file, url };
    });
    setNewFiles((list) => [...list, ...added]);
    setError(problem);
  }

  function discardNew(index) {
    URL.revokeObjectURL(newFiles[index].url);
    setNewFiles((list) => list.filter((_, i) => i !== index));
  }

  // ----- submit -----
  function validate() {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.description.trim()) return "Description is required.";

    const price = Number(form.price);
    if (form.price.trim() === "" || !Number.isFinite(price) || price < 0) {
      return "Enter a valid price (0 or more).";
    }
    if (Math.abs(price * 100 - Math.round(price * 100)) > 1e-6) {
      return "Price can have at most 2 decimal places.";
    }

    const stock = Number(form.stock);
    if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      return "Stock must be a whole number (0 or more).";
    }

    if (!form.category) return "Choose a category.";

    const names = colors.map((c) => c.name.trim().toLowerCase());
    if (names.some((n) => !n)) return "Every color needs a name.";
    if (new Set(names).size !== names.length) return "Two colors have the same name.";

    return "";
  }

  async function submit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          sizes,
          colors: colors.map((c) => ({ name: c.name.trim(), hex: c.hex })),
          isBestSeller: form.isBestSeller,
          isNewArrival: form.isNewArrival,
        },
        newFiles.map((n) => n.file),
        removedIds,
      );
      // On success the parent closes this modal.
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="entity-backdrop">
      <div className="entity-modal product-modal">
        <div className="entity-modal-head">
          <h2>{editing ? "Edit" : "Add"} Product</h2>
          <button type="button" className="bare-icon" onClick={onClose} disabled={saving}>
            <X />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>
            Product name
            <input value={form.name} onChange={setText("name")} required />
          </label>

          <label>
            Description
            <textarea rows={3} value={form.description} onChange={setText("description")} />
          </label>

          <div className="row-3">
            <label>
              Price ($)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={setText("price")}
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={setText("stock")}
              />
            </label>
            <label>
              Category
              <select value={form.category} onChange={setText("category")}>
                <option value="">Select...</option>
                {options.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {categoriesError && (
            <p className="modal-error">Could not load categories: {categoriesError}</p>
          )}
          {!categoriesError && categories.length === 0 && !editing && (
            <p className="modal-hint">
              No categories yet. Create one on the Categories page first.
            </p>
          )}

          <div className="field-group">
            <span className="field-label">Sizes</span>
            <div className="chip-row">
              {SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`chip ${sizes.includes(size) ? "chip-on" : ""}`}
                  aria-pressed={sizes.includes(size)}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="modal-hint">Leave empty for products without sizes, like bags.</p>
          </div>

          <div className="field-group">
            <span className="field-label">Colors</span>
            <div className="chip-row">
              {COLOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  className="chip"
                  onClick={() => addPreset(preset)}
                >
                  <span className="chip-dot" style={{ background: preset.hex }} />
                  {preset.name}
                </button>
              ))}
              <button type="button" className="chip" onClick={addCustomColor}>
                + Custom
              </button>
            </div>
            <p className="modal-hint">
              Use the quick-add names so the store's color filter finds this product.
            </p>

            {colors.map((color, i) => (
              <div className="color-row" key={i}>
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(i, { hex: e.target.value })}
                  aria-label="Pick color"
                />
                <input
                  value={color.name}
                  onChange={(e) => updateColor(i, { name: e.target.value })}
                  placeholder="Color name"
                />
                <button type="button" title="Remove color" onClick={() => removeColor(i)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="field-group">
            <span className="field-label">
              Images ({totalImages}/{MAX_IMAGES}) — the first one is the main photo
            </span>
            <div className="img-grid">
              {savedImages.map((img, i) => (
                <div className="img-tile" key={img._id}>
                  <img src={img.url} alt="" />
                  {i === 0 && <span className="img-tile-tag">Main</span>}
                  <button
                    type="button"
                    className="img-tile-remove"
                    title="Remove image"
                    onClick={() => setRemovedIds((ids) => [...ids, img._id])}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {newFiles.map((n, i) => (
                <div className="img-tile" key={n.url}>
                  <img src={n.url} alt="" />
                  <span className="img-tile-tag">
                    {savedImages.length === 0 && i === 0 ? "Main · New" : "New"}
                  </span>
                  <button
                    type="button"
                    className="img-tile-remove"
                    title="Discard image"
                    onClick={() => discardNew(i)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {totalImages < MAX_IMAGES && (
                <button
                  type="button"
                  className="img-add"
                  onClick={() => fileInput.current.click()}
                >
                  <Plus size={18} />
                  Add
                </button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={pickFiles}
            />
            <p className="modal-hint">
              Removing or adding images only takes effect when you press Save.
            </p>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={setFlag("isBestSeller")}
            />
            Show in Best Sellers
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={setFlag("isNewArrival")}
            />
            Show in New Arrivals
          </label>

          {error && <p className="modal-error">{error}</p>}

          <div className="entity-actions">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
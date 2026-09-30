import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "../EntityModal/EntityModal.css";
import "./CategoryModal.css";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CategoryModal({ initial, onClose, onSave }) {
  const editing = Boolean(initial);
  const fileInput = useRef(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shownImage =
    preview || (removeImage ? null : initial?.image?.url) || null;

  function pickFile(e) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    if (!ALLOWED_TYPES.includes(picked.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setError("");
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setRemoveImage(false);
  }

  function dropImage() {
    if (file) {
      // Discard the new pick (falls back to the saved image, if any)
      setFile(null);
      setPreview(null);
    } else {
      setRemoveImage(true);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(
        { name: name.trim(), description: description.trim(), isActive },
        file,
        removeImage,
      );
      // On success the parent closes this modal.
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="entity-backdrop" onClick={saving ? undefined : onClose}>
      <div className="entity-modal" onClick={(e) => e.stopPropagation()}>
        <div className="entity-modal-head">
          <h2>{editing ? "Edit" : "Add"} Category</h2>
          <button type="button" className="bare-icon" onClick={onClose} disabled={saving}>
            <X />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>
            Category name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="cat-modal-image">
            {shownImage ? (
              <img className="cat-modal-preview" src={shownImage} alt="Category" />
            ) : (
              <div className="cat-modal-preview cat-modal-preview--empty">No image</div>
            )}
            <div className="cat-modal-image-actions">
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={pickFile}
                hidden
              />
              <button
                type="button"
                className="btn btn-light"
                onClick={() => fileInput.current.click()}
              >
                {shownImage ? "Change image" : "Choose image"}
              </button>
              {shownImage && (
                <button type="button" className="btn btn-light" onClick={dropImage}>
                  {file ? "Discard new image" : "Remove image"}
                </button>
              )}
            </div>
          </div>

          {editing && (
            <label className="check-row">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Visible on the storefront
            </label>
          )}

          {error && <p className="modal-error">{error}</p>}

          <div className="entity-actions">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
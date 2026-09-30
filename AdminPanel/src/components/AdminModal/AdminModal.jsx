import { useState } from "react";
import { X } from "lucide-react";
import "../EntityModal/EntityModal.css";

export default function AdminModal({ onClose, onSave }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave({ fullName: fullName.trim(), email: email.trim(), password });
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
          <h2>Add Admin</h2>
          <button type="button" className="bare-icon" onClick={onClose} disabled={saving}>
            <X />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Temporary password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <p className="modal-hint">
            Share this password with them directly. There's no "forgot password" recovery yet,
            so they should change it after their first login once that's built.
          </p>

          {error && <p className="modal-error">{error}</p>}

          <div className="entity-actions">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
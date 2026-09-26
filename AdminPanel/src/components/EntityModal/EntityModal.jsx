import React, { useState } from "react";
import { X } from "lucide-react";
import "./EntityModal.css";
const fields = {
  Products: [
    ["name", "Product name"],
    ["sku", "SKU"],
    ["category", "Category"],
    ["price", "Price", "number"],
    ["stock", "Stock", "number"],
  ],
  Categories: [
    ["name", "Category name"],
    ["description", "Description"],
  ],
  Coupons: [
    ["code", "Coupon code"],
    ["type", "Discount type", "select", ["Percentage", "Fixed"]],
    ["value", "Discount value", "number"],
    ["expiry", "Expiry date", "date"],
  ],
  Admins: [
    ["name", "Full name"],
    ["email", "Admin email", "email"],
    ["role", "Role", "select", ["Admin", "Super Admin"]],
  ],
};
export default function EntityModal({ type, initial, onClose, onSave }) {
  const schema = fields[type] || [];
  const [form, setForm] = React.useState(initial || {});
  function submit(e) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div className="entity-backdrop" onClick={onClose}>
      <div className="entity-modal" onClick={(e) => e.stopPropagation()}>
        <div className="entity-modal-head">
          <h2>
            {initial ? "Edit" : "Add"} {type.slice(0, -1)}
          </h2>
          <button className="bare-icon" onClick={onClose}>
            <X />
          </button>
        </div>
        <form onSubmit={submit}>
          {schema.map(([key, label, inputType, options]) => (
            <label key={key}>
              {label}
              {inputType === "select" ? (
                <select
                  required
                  value={form[key] ?? options[0]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                >
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type={inputType || "text"}
                  value={form[key] ?? ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              )}
            </label>
          ))}
          <div className="entity-actions">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

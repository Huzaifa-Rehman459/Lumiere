import { Download, Plus } from "lucide-react";
import "./Toolbar.css";
export default function Toolbar({
  count,
  onExport,
  onAdd,
  addLabel = "Add New",
}) {
  return (
    <div className="table-toolbar">
      <span>{count} items</span>
      <div>
        <button className="btn btn-light" onClick={onExport}>
          <Download size={14} />
          Export CSV
        </button>
        {onAdd && (
          <button className="btn btn-primary" onClick={onAdd}>
            <Plus size={15} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

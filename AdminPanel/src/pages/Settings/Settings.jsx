import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import "./Settings.css";
export default function Settings() {
  const { data, resetDemo, notify, isSuperAdmin } = useAdmin();
  return (
    <PageContent
      title="Settings"
      description="Configure store preferences and administrator access."
    >
      <div className="settings-grid">
        <Panel>
          <h2>Store Preferences</h2>
          <label>
            Store name
            <input defaultValue="Lumière" />
          </label>
          <label>
            Support email
            <input defaultValue="hello@lumiere.com" />
          </label>
          <label>
            Currency
            <select defaultValue="USD">
              <option>USD</option>
              <option>PKR</option>
              <option>GBP</option>
            </select>
          </label>
          <button
            className="btn btn-primary"
            onClick={() => notify("Settings saved for this session")}
          >
            Save Changes
          </button>
        </Panel>
        <Panel>
          <h2>Security & Access</h2>
          <p className="settings-notice">
            Demo role access. Enforce authorization on your backend before
            production.
          </p>
          <p>{data.admins.length} admin accounts</p>
          {isSuperAdmin && (
            <a className="btn btn-light" href="/admins">
              Manage Admins
            </a>
          )}
          <hr />
          <button
            className="btn btn-light"
            onClick={() => {
              if (confirm("Reset sample data?")) {
                resetDemo();
                notify("Demo data reset");
              }
            }}
          >
            Reset Demo Data
          </button>
        </Panel>
      </div>
    </PageContent>
  );
}

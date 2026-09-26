import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import "./Login.css";
export default function Login() {
  const { login, isAuthenticated, notify } = useAdmin(),
    navigate = useNavigate();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  if (isAuthenticated) return <Navigate to="/" replace />;
  function submit(e) {
    e.preventDefault();
    if (login(email, password)) navigate("/");
    else notify("Use an active demo admin email and password admin123");
  }
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={submit}>
        <div className="login-brand">Lumière</div>
        <small>STORE MANAGEMENT</small>
        <h1>Welcome back</h1>
        <p>Sign in to manage your boutique.</p>
        <label>
          Admin email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Admin email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        <button className="btn btn-primary login-submit">Sign in →</button>
        <div className="demo-access">
          <b>Demo access</b>
          <span>superadmin@lumiere.com</span>
          <span>Password: admin123</span>
          <button
            type="button"
            onClick={() => {
              setEmail("superadmin@lumiere.com");
              setPassword("admin123");
            }}
          >
            Fill demo login
          </button>
        </div>
        <small className="login-footnote">
          Frontend demo — backend authentication required for production.
        </small>
      </form>
      <div className="login-art">
        <h2>
          Better Fashion.
          <br />
          Brighter Tomorrow.
        </h2>
      </div>
    </div>
  );
}

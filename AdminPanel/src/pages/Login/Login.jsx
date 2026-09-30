import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import "./Login.css";

export default function Login() {
  const { login, isAuthenticated, authNotice, clearAuthNotice } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    clearAuthNotice();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={submit}>
        <div className="login-brand">Lumière</div>
        <small>STORE MANAGEMENT</small>
        <h1>Welcome back</h1>
        <p>Sign in to manage your boutique.</p>

        {authNotice && <p className="login-notice">{authNotice}</p>}

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

        {error && <p className="login-error">{error}</p>}

        <button className="btn btn-primary login-submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in →"}
        </button>
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
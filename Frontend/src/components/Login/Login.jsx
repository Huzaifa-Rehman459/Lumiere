import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-form-side">
          <h1 className="auth-brand">Lumière</h1>
          <div className="auth-heading">
            <h2>Welcome back</h2>
            <p>
              Login to continue shopping and pick up right where you left off.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="forgot-box">
              <label className="check-box">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="">Forgot Password?</a>
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="seprator">
            <span />
            <p>Or continue with</p>
            <span />
          </div>

          <div className="social-buttons">
            <button type="button">Google</button>
            <button type="button">Facebook</button>
          </div>

          <div className="signup-box">
            <span>Don't have an account?</span>
            <Link to="/SignUp">Sign Up</Link>
          </div>
        </div>

        <div className="auth-panel">
          <span className="auth-panel-mark">“</span>
          <p className="auth-panel-quote">
            Pieces that feel like they were already yours.
          </p>
          <p className="auth-panel-sub">Welcome back to Lumière.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
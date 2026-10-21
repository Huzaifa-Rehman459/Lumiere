import { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: { fullName, email, password },
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
            <h2>Create your account</h2>
            <p>
              Join us for early access to new arrivals and member-only pricing.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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

            <button type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Sign Up"}
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
            <span>Already have an account?</span>
            <Link to="/Login">Login</Link>
          </div>
        </div>

        <div className="auth-panel">
          <span className="auth-panel-mark">“</span>
          <p className="auth-panel-quote">
            Fewer, better pieces — made to actually live in.
          </p>
          <p className="auth-panel-sub">Join Lumière today.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
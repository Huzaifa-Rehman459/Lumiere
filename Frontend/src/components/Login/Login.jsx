import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/pexels-dhanno-25184995.jpg";
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
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <h1>Lumière</h1>
          <div className="welcome-text">
            <h1>Welcome Back</h1>
            <p>
              Login to your account to continue shopping
              <br />
              and get the best deals.
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
              <div className="check-box">
                <input type="checkbox" />
                <span>Remember me</span>
              </div>
              <a href="">Forgot Password?</a>
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="seprator">
            <span>___________</span>
            <p>Or continue with</p>
            <span>___________</span>
          </div>
          <div className="social-buttons">
            <button type="button">Google</button>
            <button type="button">Facebook</button>
          </div>
          <div className="signup-box">
            <span>Dont have an account?</span>
            <Link to="/SignUp">Sign Up</Link>
          </div>
        </div>
      </div>
      <div className="login-right">
        <img src={loginImg} alt="Login" />
      </div>
    </div>
  );
};

export default Login;
import { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import signUpImg from "../../assets/pexels-dhanno-25184951.jpg";
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
      navigate("/"); // signup always creates a normal user, never an admin
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-left-content">
          <h1>Lumière</h1>
          <div className="welcome-text">
            <h1>Create Your Account</h1>
            <p>
              Join us and get access to exclusive offers,
              <br />
              new articles and more.
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
            <span>___________</span>
            <p>Or continue with</p>
            <span>___________</span>
          </div>
          <div className="social-buttons">
            <button type="button">Google</button>
            <button type="button">Facebook</button>
          </div>
          <div className="login-box">
            <span>Already have an account?</span>
            <Link to="/Login">Login</Link>
          </div>
        </div>
      </div>
      <div className="signup-right">
        <img src={signUpImg} alt="Sign Up" />
      </div>
    </div>
  );
};

export default SignUp;
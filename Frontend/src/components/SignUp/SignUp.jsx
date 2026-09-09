import React from "react";
import "./SignUp.css";
import { Link } from 'react-router-dom';
import signUpImg from "../../assets/pexels-dhanno-25184951.jpg"

const SignUp = () => {
  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-left-content">
          <h1>Lumière</h1>
          <div className="welcome-text">
            <h1>Create Your Account</h1>
            <p>
              Join us and get access to exclusive offers,<br></br>new articles and more.
            </p>
          </div>
          <form>
            <div className="input-box">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name"></input>
            </div>
            <div className="input-box">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com"></input>
            </div>
            <div className="input-box">
              <label>Password</label>
              <input type="password" placeholder="Enter your password"></input>
            </div>
            <button>Sign Up</button>
          </form>
          <div className="seprator">
            <span>___________</span>
            <p>Or continue with</p>
            <span>___________</span>
          </div>
          <div className="social-buttons">
            <button>Google</button>
            <button>Facebook</button>
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

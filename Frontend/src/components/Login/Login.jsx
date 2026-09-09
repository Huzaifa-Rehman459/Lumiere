import React from 'react'
import "./Login.css"
import { Link } from 'react-router-dom';
import loginImg from "../../assets/pexels-dhanno-25184995.jpg"

const Login = () => {
  return (
    <div className='login-page'>
      <div className="login-left">
        <div className="login-left-content">
            <h1>Lumière</h1>
            <div className="welcome-text">
                <h1>Welcome Back</h1>
                <p>Login to your account to continue shopping<br></br>and get the best deals.</p>
            </div>
            <form>
                <div className="input-box">
                    <label>Email Address</label>
                    <input type='email' placeholder='you@example.com'></input>
                </div>
                <div className="input-box">
                    <label>Password</label>
                    <input type='password' placeholder='Enter your password'></input>
                </div>
                <div className="forgot-box">
                    <div className="check-box">
                    <input type='checkbox'></input>
                    <span>Remember me</span>
                </div>
                <a href=''>Forgot Password?</a>
                </div>
                <button>Login</button>
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
  )
}

export default Login

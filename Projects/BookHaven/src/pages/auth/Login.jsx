import { useState } from "react";
import axios from "@/services/api";
import { useNavigate } from "react-router-dom";
import '../../styles/Login.css';



const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);
      const { token, user, roles } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", roles[0]);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/")

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">
        <h2 className="login-title">Welcome Back!</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="jhon@123"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? (
                // Eye Open Icon (replace with your preferred icon if using a library)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                // Eye Closed Icon (replace with your preferred icon if using a library)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 18.571A8.25 8.25 0 0 0 12 20.25c4.787 0 8.874-2.215 10.15-6.046M2.38 9.75h1.777a8.995 8.995 0 0 1 12.122 0M12 12.75l1.5.75m-.75 2.25l-.75 1.5M12 12.75l-1.5.75m.75 2.25l.75 1.5M12 12.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>
        </form>
        <p className="signup-text">
          Don't have an account?{' '}
          <a href="/register" className="signup-link">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
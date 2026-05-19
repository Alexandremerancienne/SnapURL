import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, LogIn, User } from "lucide-react";
import { login } from "../../api/auth";

export default function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ username, password });
      
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setUsername("");
      setPassword("");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-heading">
          <span className="auth-kicker">Welcome back</span>
          <h1>
            Login to{" "}
            <Link to="/">
              <span className="gradient-text">SnapURL</span>
            </Link>
          </h1>
          <p>Access your links, stats, and saved shortcuts.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Username</span>
            <div className="auth-input">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Your username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          <button type="submit" className="btn auth-submit">
            <LogIn size={16} className="btn-icon" />
            <span>Login</span>
          </button>
        </form>

        <p className="auth-switch">
          New to SnapURL? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, UserPlus } from "lucide-react";
import { register } from "../../api/auth";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register({ email, password });
      console.log("Registration successful:", data);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-heading">
          <span className="auth-kicker">Start shortening</span>
          <h1>
            Create your{" "}
            <Link to="/">
              <span className="gradient-text">SnapURL</span>
            </Link>{" "}
            account
          </h1>
          <p>
            Save links, manage campaigns, and keep every short URL organized.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Email</span>
            <div className="auth-input">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          <button type="submit" className="btn auth-submit">
            <UserPlus size={16} className="btn-icon" />
            <span>Register</span>
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

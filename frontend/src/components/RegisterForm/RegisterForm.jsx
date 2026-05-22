import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import { register } from "../../api/auth";

const getRegisterErrorMessage = (error) => {
  const data = error.response?.data;

  if (!data) {
    return "Registration failed. Please try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  const firstError = Object.entries(data)[0];

  if (!firstError) {
    return "Registration failed. Please check your details.";
  }

  const [field, messages] = firstError;
  const message = Array.isArray(messages) ? messages[0] : messages;

  return `${field}: ${message}`;
};

export default function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      navigate("/login");
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
          {errorMessage && <p className="auth-error">{errorMessage}</p>}

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

          <label className="auth-field">
            <span>Confirm password</span>
            <div className="auth-input">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </label>

          <button
            type="submit"
            className="btn auth-submit"
            disabled={isSubmitting}
          >
            <UserPlus size={16} className="btn-icon" />
            <span>{isSubmitting ? "Registering..." : "Register"}</span>
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

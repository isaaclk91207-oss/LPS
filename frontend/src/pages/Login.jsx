import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import logo from "../assets/uabcafe-logo.jpg";
import bgImage from "../assets/uab-outside.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${bgImage})` }}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        <img src={logo} alt="uab Cafe" style={styles.logo} />
        <h1 style={styles.title}>uab Cafe Loyalty</h1>
        <h2 style={styles.subtitle}>Customer Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>
        <p style={styles.link}>
          <Link to="/barista/login">Barista Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(62, 39, 35, 0.4)",
  },
  card: {
    background: "rgba(255, 248, 231, 0.95)",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(62, 39, 35, 0.3)",
    width: "100%",
    maxWidth: "360px",
    position: "relative",
    zIndex: 1,
    backdropFilter: "blur(10px)",
  },
  logo: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    margin: "0 auto 1rem",
    border: "3px solid var(--brown-mid)",
  },
  title: {
    textAlign: "center",
    margin: 0,
    color: "var(--brown-dark)",
    fontSize: "1.5rem",
  },
  subtitle: {
    textAlign: "center",
    marginTop: "0.25rem",
    color: "var(--brown-light)",
    fontWeight: "normal",
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "0.85rem 1rem",
    marginBottom: "0.85rem",
    border: "2px solid var(--brown-light)",
    borderRadius: "12px",
    fontSize: "1rem",
    boxSizing: "border-box",
    background: "var(--white)",
  },
  button: {
    width: "100%",
    padding: "0.85rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  error: {
    color: "var(--error)",
    textAlign: "center",
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
  },
  link: {
    textAlign: "center",
    marginTop: "0.75rem",
    fontSize: "0.9rem",
    color: "var(--brown-mid)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "1rem 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "var(--brown-light)",
  },
  dividerText: {
    color: "var(--brown-light)",
    fontSize: "0.85rem",
  },
};

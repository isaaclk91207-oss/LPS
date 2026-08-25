import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import logo from "../assets/uabcafe-logo.jpg";
import uabOutside from "../assets/uab-outside.jpg";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        username: form.username,
        password: form.password,
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${uabOutside})` }}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        <img src={logo} alt="uab Cafe" style={styles.logo} />
        <h1 style={styles.title}>uab Cafe Loyalty</h1>
        <h2 style={styles.subtitle}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <input style={styles.input} type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input style={styles.input} type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
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
};

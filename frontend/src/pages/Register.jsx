import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

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
    <div style={styles.container}>
      <div style={styles.card}>
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
    background: "#f0f2f5",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "360px",
  },
  title: {
    textAlign: "center",
    margin: 0,
    color: "#2d6a4f",
  },
  subtitle: {
    textAlign: "center",
    marginTop: "0.25rem",
    color: "#666",
    fontWeight: "normal",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    background: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: "0.5rem",
  },
  link: {
    textAlign: "center",
    marginTop: "0.75rem",
    fontSize: "0.9rem",
  },
};

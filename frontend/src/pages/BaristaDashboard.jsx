import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function BaristaDashboard() {
  const name = localStorage.getItem("name");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/barista/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/barista/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Barista Portal</h1>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.welcome}>Welcome, {name}</h2>
      </div>

      {/* Stats */}
      {stats && (
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total_customers}</div>
            <div style={styles.statLabel}>Customers</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total_points}</div>
            <div style={styles.statLabel}>Points Given</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total_rewards}</div>
            <div style={styles.statLabel}>Rewards</div>
          </div>
        </div>
      )}

      <div style={styles.actions}>
        <button style={styles.scanBtn} onClick={() => navigate("/barista/scan")}>
          Scan Customer QR
        </button>
        <button style={styles.searchBtn} onClick={() => navigate("/barista/search")}>
          Find Customer
        </button>
        <button style={styles.historyBtn} onClick={() => navigate("/barista/history")}>
          Transaction History
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    padding: "1rem",
    maxWidth: "480px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  title: {
    margin: 0,
    color: "#1a5276",
    fontSize: "1.25rem",
  },
  logoutBtn: {
    padding: "0.4rem 0.8rem",
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  card: {
    background: "#fff",
    padding: "1.25rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "1rem",
  },
  welcome: {
    margin: 0,
    color: "#333",
  },
  statsRow: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  statCard: {
    flex: 1,
    background: "#fff",
    padding: "1rem 0.75rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#1a5276",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#888",
    marginTop: "0.25rem",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  scanBtn: {
    padding: "1rem",
    background: "#1a5276",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  searchBtn: {
    padding: "1rem",
    background: "#fff",
    color: "#1a5276",
    border: "2px solid #1a5276",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  historyBtn: {
    padding: "1rem",
    background: "#fff",
    color: "#1a5276",
    border: "2px solid #1a5276",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
};

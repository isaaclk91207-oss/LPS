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

      <div style={styles.welcomeCard}>
        <h2 style={styles.welcome}>Welcome, {name}</h2>
      </div>

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
        <button style={styles.secondaryBtn} onClick={() => navigate("/barista/search")}>
          Find Customer
        </button>
        <button style={styles.secondaryBtn} onClick={() => navigate("/barista/history")}>
          Transaction History
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--cream)",
    padding: "1rem",
    maxWidth: "480px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  title: {
    margin: 0,
    color: "var(--brown-dark)",
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    background: "var(--brown-light)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  welcomeCard: {
    background: "var(--brown-dark)",
    padding: "1.25rem 1.5rem",
    borderRadius: "14px",
    marginBottom: "1rem",
    color: "var(--cream)",
  },
  welcome: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: "500",
  },
  statsRow: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  statCard: {
    flex: 1,
    background: "var(--cream-light)",
    padding: "1rem 0.75rem",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(62, 39, 35, 0.08)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "var(--brown-dark)",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "var(--brown-light)",
    marginTop: "0.25rem",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  scanBtn: {
    padding: "1rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "1rem",
    background: "var(--cream-light)",
    color: "var(--brown-dark)",
    border: "2px solid var(--brown-mid)",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
};

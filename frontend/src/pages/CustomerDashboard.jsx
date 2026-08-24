import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    setRefreshing(true);
    setError("");
    api.get("/customer/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard. Please try again."))
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(loadData, [loadData]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  if (error && !data) return (
    <div style={styles.page}>
      <div style={styles.errorCard}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryBtn} onClick={loadData}>Retry</button>
      </div>
    </div>
  );

  if (!data) return <div style={styles.loading}>Loading...</div>;

  const { customer, progress } = data;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>UAB Cafe Loyalty</h1>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.welcome}>{customer.name}</h2>
          <button style={styles.refreshBtn} onClick={loadData} disabled={refreshing}>
            {refreshing ? "..." : "Refresh"}
          </button>
        </div>
        <p style={styles.code}>Code: <strong>{customer.customer_code}</strong></p>
      </div>

      {/* Coffee Reward */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Coffee Reward</h3>
          <span style={styles.badge}>{progress.coffee_progress}/10</span>
        </div>
        <div style={styles.cupsRow}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={styles.cup(i < progress.coffee_progress)}>
              {i < progress.coffee_progress ? "\u2615" : "\u2610"}
            </span>
          ))}
        </div>
        {progress.coffee_reward_available ? (
          <div style={styles.rewardBanner}>Reward Available: Free Coffee</div>
        ) : (
          <p style={styles.rewardPending}>{10 - progress.coffee_progress} more to go</p>
        )}
      </div>

      {/* Tumbler Reward */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Tumbler Reward</h3>
          <span style={styles.badge}>{progress.tumbler_progress}/80</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${(progress.tumbler_progress / 80) * 100}%` }} />
        </div>
        {progress.tumbler_reward_available ? (
          <div style={styles.rewardBanner}>Reward Available: Free Tumbler</div>
        ) : (
          <p style={styles.rewardPending}>{80 - progress.tumbler_progress} more to go</p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button style={styles.primaryBtn} onClick={() => navigate("/customer/qr")}>My QR Code</button>
        <button style={styles.secondaryBtn} onClick={() => navigate("/customer/points")}>My Points</button>
        <button style={styles.secondaryBtn} onClick={() => navigate("/customer/history")}>Reward History</button>
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
    color: "#2d6a4f",
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
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    margin: 0,
    color: "#333",
    fontSize: "1.2rem",
  },
  refreshBtn: {
    padding: "0.3rem 0.6rem",
    background: "#e8f5e9",
    color: "#2d6a4f",
    border: "1px solid #2d6a4f",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  code: {
    margin: "0.5rem 0 0",
    color: "#666",
  },
  cardTitle: {
    margin: 0,
    color: "#2d6a4f",
    fontSize: "1rem",
  },
  badge: {
    background: "#e8f5e9",
    color: "#2d6a4f",
    padding: "0.2rem 0.6rem",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  cupsRow: {
    display: "flex",
    gap: "0.25rem",
    flexWrap: "wrap",
    marginBottom: "0.5rem",
  },
  cup: (active) => ({
    fontSize: "1.5rem",
    opacity: active ? 1 : 0.3,
  }),
  progressBarBg: {
    width: "100%",
    height: "12px",
    background: "#e0e0e0",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "0.5rem",
  },
  progressBarFill: {
    height: "100%",
    background: "#2d6a4f",
    borderRadius: "6px",
    transition: "width 0.3s",
  },
  rewardBanner: {
    background: "#e8f5e9",
    color: "#2d6a4f",
    padding: "0.5rem",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  rewardPending: {
    color: "#999",
    margin: "0.5rem 0 0",
    fontSize: "0.9rem",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
  },
  primaryBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "#fff",
    color: "#2d6a4f",
    border: "2px solid #2d6a4f",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "1.2rem",
  },
  errorCard: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    textAlign: "center",
    marginTop: "4rem",
  },
  errorText: {
    color: "#c62828",
    marginBottom: "1rem",
  },
  retryBtn: {
    padding: "0.6rem 1.5rem",
    background: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

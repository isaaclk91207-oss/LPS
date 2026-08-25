import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CoffeeCup from "../components/CoffeeCup";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    setError("");
    api.get("/customer/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard. Please try again."));
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
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>uab Cafe</h1>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* Wallet Card */}
      <div style={styles.walletCard}>
        <div style={styles.walletHeader}>
          <h2 style={styles.walletTitle}>Coffee Card</h2>
          <span style={styles.pointsBadge}>{customer.total_points} pts</span>
        </div>
        <p style={styles.walletCode}>{customer.customer_code}</p>

        {/* Coffee Stamp Grid */}
        <div style={styles.stampSection}>
          <div style={styles.stampGrid}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={styles.stampItem}>
                <CoffeeCup filled={i < progress.coffee_progress} size={44} />
              </div>
            ))}
          </div>
          <div style={styles.stampInfo}>
            <span>Remaining: {10 - progress.coffee_progress}</span>
            <span>Stamps: {String(progress.coffee_progress).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Reward Available */}
        {progress.coffee_reward_available && (
          <div style={styles.rewardBanner}>
            Reward Available: Free Coffee!
          </div>
        )}

        {/* Tumbler Progress */}
        <div style={styles.tumblerSection}>
          <div style={styles.tumblerHeader}>
            <span style={styles.tumblerLabel}>Tumbler Progress</span>
            <span style={styles.tumblerCount}>{progress.tumbler_progress}/80</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${(progress.tumbler_progress / 80) * 100}%` }} />
          </div>
          {progress.tumbler_reward_available && (
            <div style={styles.rewardBanner}>Free Tumbler Ready!</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button style={styles.primaryBtn} onClick={() => navigate("/customer/qr")}>
          My QR Code
        </button>
        <div style={styles.secondaryRow}>
          <button style={styles.secondaryBtn} onClick={() => navigate("/customer/points")}>
            My Points
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/customer/history")}>
            History
          </button>
        </div>
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
  walletCard: {
    background: "var(--brown-dark)",
    padding: "1.5rem",
    borderRadius: "20px",
    marginBottom: "1rem",
    color: "var(--cream)",
  },
  walletHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.25rem",
  },
  walletTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  pointsBadge: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  walletCode: {
    margin: "0 0 1.25rem",
    color: "var(--brown-light)",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
  },
  stampSection: {
    background: "var(--cream-light)",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  stampGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },
  stampItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  stampInfo: {
    display: "flex",
    justifyContent: "space-between",
    color: "var(--brown-dark)",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  rewardBanner: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.65rem",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  tumblerSection: {
    marginTop: "0.5rem",
  },
  tumblerHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  tumblerLabel: {
    fontSize: "0.9rem",
    color: "var(--cream)",
  },
  tumblerCount: {
    fontSize: "0.9rem",
    color: "var(--gold)",
    fontWeight: "600",
  },
  progressBarBg: {
    width: "100%",
    height: "10px",
    background: "var(--brown-light)",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    background: "var(--gold)",
    borderRadius: "5px",
    transition: "width 0.3s",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  primaryBtn: {
    width: "100%",
    padding: "1rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryRow: {
    display: "flex",
    gap: "0.75rem",
  },
  secondaryBtn: {
    flex: 1,
    padding: "0.85rem",
    background: "var(--cream-light)",
    color: "var(--brown-dark)",
    border: "2px solid var(--brown-mid)",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "var(--brown-dark)",
  },
  errorCard: {
    background: "var(--cream-light)",
    padding: "2rem",
    borderRadius: "16px",
    textAlign: "center",
    marginTop: "4rem",
  },
  errorText: {
    color: "var(--error)",
    marginBottom: "1rem",
  },
  retryBtn: {
    padding: "0.7rem 2rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

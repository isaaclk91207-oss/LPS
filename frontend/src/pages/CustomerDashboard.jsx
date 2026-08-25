import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CoffeeCup from "../components/CoffeeCup";
import TumblerCard from "../components/TumblerCard";
import ActivityItem from "../components/ActivityItem";
import BottomNav from "../components/BottomNav";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitial = (n) => n ? n.charAt(0).toUpperCase() : "U";

  if (error && !data) return (
    <div style={styles.page}>
      <div style={styles.errorCard}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryBtn} onClick={loadData}>Retry</button>
      </div>
    </div>
  );

  if (!data) return <div style={styles.loading}>Loading...</div>;

  const { customer, progress, history } = data;

  const recentActivity = history ? history.slice(0, 3) : [];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <p style={styles.greeting}>{getGreeting()}</p>
          <h1 style={styles.name}>{name}</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.avatar}>{getInitial(name)}</div>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Coffee Stamp Card */}
      <div style={styles.walletCard}>
        <div style={styles.walletHeader}>
          <div>
            <h2 style={styles.walletTitle}>Coffee Card</h2>
            <p style={styles.walletCode}>{customer.customer_code}</p>
          </div>
          <span style={styles.pointsBadge}>{customer.total_points} pts</span>
        </div>

        <div style={styles.stampSection}>
          <div style={styles.stampGrid}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={styles.stampItem}>
                <CoffeeCup filled={i < progress.coffee_progress} size={40} />
              </div>
            ))}
          </div>
          <div style={styles.stampInfo}>
            <span style={styles.stampLabel}>Remaining: {10 - progress.coffee_progress}</span>
            <span style={styles.stampLabel}>Stamps: {String(progress.coffee_progress).padStart(2, '0')}</span>
          </div>
        </div>

        {progress.coffee_reward_available && (
          <div style={styles.rewardBanner}>Free Coffee Ready!</div>
        )}
      </div>

      {/* Tumbler Reward */}
      <div style={styles.section}>
        <TumblerCard
          progress={progress.tumbler_progress}
          max={80}
          rewardAvailable={progress.tumbler_reward_available}
        />
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <button style={styles.actionCard} onClick={() => navigate("/customer/qr")}>
            <span style={styles.actionIcon}>📱</span>
            <span style={styles.actionLabel}>My QR</span>
          </button>
          <button style={styles.actionCard} onClick={() => navigate("/customer/points")}>
            <span style={styles.actionIcon}>💰</span>
            <span style={styles.actionLabel}>Points</span>
          </button>
          <button style={styles.actionCard} onClick={() => navigate("/customer/history")}>
            <span style={styles.actionIcon}>📜</span>
            <span style={styles.actionLabel}>History</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>
          <div style={styles.activityCard}>
            {recentActivity.map((item) => (
              <ActivityItem
                key={item.id}
                type={item.reward_type === "coffee" || item.reward_type === "tumbler" ? "reward" : "point"}
                text={item.reward_type === "coffee" ? "Free Coffee Redeemed" : item.reward_type === "tumbler" ? "Free Tumbler Redeemed" : `+${item.points || 1} Point`}
                time={item.redeemed_at || item.created_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing for nav */}
      <div style={{ height: "80px" }} />
      <BottomNav role="customer" />
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
    paddingBottom: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    margin: 0,
    fontSize: "0.85rem",
    color: "var(--brown-light)",
  },
  name: {
    margin: "0.15rem 0 0",
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "var(--brown-dark)",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  logoutBtn: {
    padding: "0.4rem 0.75rem",
    background: "transparent",
    color: "var(--brown-light)",
    border: "1px solid var(--brown-light)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  walletCard: {
    background: "var(--brown-dark)",
    padding: "1.25rem",
    borderRadius: "20px",
    marginBottom: "1rem",
    color: "var(--cream)",
  },
  walletHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  walletTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: "600",
  },
  walletCode: {
    margin: "0.2rem 0 0",
    fontSize: "0.75rem",
    color: "var(--brown-light)",
    letterSpacing: "0.1em",
  },
  pointsBadge: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.3rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  stampSection: {
    background: "var(--cream-light)",
    borderRadius: "12px",
    padding: "0.85rem",
  },
  stampGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "0.4rem",
    marginBottom: "0.6rem",
  },
  stampItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  stampInfo: {
    display: "flex",
    justifyContent: "space-between",
  },
  stampLabel: {
    color: "var(--brown-dark)",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  rewardBanner: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.6rem",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.85rem",
    marginTop: "0.85rem",
  },
  section: {
    marginBottom: "1rem",
  },
  sectionTitle: {
    margin: "0 0 0.65rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--brown-dark)",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.65rem",
  },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.85rem 0.5rem",
    background: "var(--cream-light)",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.06)",
    transition: "transform 0.2s",
  },
  actionIcon: {
    fontSize: "1.4rem",
  },
  actionLabel: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "var(--brown-dark)",
  },
  activityCard: {
    background: "var(--cream-light)",
    borderRadius: "14px",
    padding: "0.5rem 0.85rem",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.06)",
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

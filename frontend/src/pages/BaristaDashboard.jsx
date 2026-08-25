import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ActivityItem from "../components/ActivityItem";
import BottomNav from "../components/BottomNav";

export default function BaristaDashboard() {
  const name = localStorage.getItem("name") || "Barista";
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/barista/stats").then((res) => setStats(res.data)).catch(() => {});
    api.get("/barista/history").then((res) => setHistory(res.data.slice(0, 3))).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/barista/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitial = (n) => n ? n.charAt(0).toUpperCase() : "B";

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

      {/* Big Scan Button */}
      <button style={styles.scanCard} onClick={() => navigate("/barista/scan")}>
        <span style={styles.scanIcon}>📷</span>
        <div style={styles.scanInfo}>
          <span style={styles.scanTitle}>Scan QR Code</span>
          <span style={styles.scanSubtitle}>Tap to scan customer loyalty card</span>
        </div>
        <span style={styles.scanArrow}>→</span>
      </button>

      {/* Stats */}
      {stats && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Today's Overview</h3>
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statValue}>{stats.total_customers}</div>
              <div style={styles.statLabel}>Customers</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statValue}>{stats.total_points}</div>
              <div style={styles.statLabel}>Points</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎁</div>
              <div style={styles.statValue}>{stats.total_rewards}</div>
              <div style={styles.statLabel}>Rewards</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsRow}>
          <button style={styles.actionBtn} onClick={() => navigate("/barista/search")}>
            <span style={styles.actionIcon}>🔍</span>
            <span style={styles.actionLabel}>Find Customer</span>
          </button>
          <button style={styles.actionBtn} onClick={() => navigate("/barista/history")}>
            <span style={styles.actionIcon}>📜</span>
            <span style={styles.actionLabel}>History</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      {history.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Transactions</h3>
          <div style={styles.activityCard}>
            {history.map((item) => (
              <ActivityItem
                key={item.id}
                type="reward"
                text={`${item.customer_name} - ${item.reward_type === "coffee" ? "Free Coffee" : "Free Tumbler"}`}
                time={item.redeemed_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing for nav */}
      <div style={{ height: "80px" }} />
      <BottomNav role="barista" />
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
  scanCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    padding: "1.25rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    marginBottom: "1.25rem",
    boxShadow: "0 4px 20px rgba(62, 39, 35, 0.25)",
    textAlign: "left",
  },
  scanIcon: {
    fontSize: "2rem",
    width: "50px",
    height: "50px",
    background: "rgba(212, 165, 116, 0.2)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scanInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  scanTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  scanSubtitle: {
    fontSize: "0.8rem",
    color: "var(--brown-light)",
    marginTop: "0.15rem",
  },
  scanArrow: {
    fontSize: "1.5rem",
    color: "var(--gold)",
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
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.65rem",
  },
  statCard: {
    background: "var(--cream-light)",
    padding: "0.85rem 0.5rem",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.06)",
  },
  statIcon: {
    fontSize: "1.3rem",
    marginBottom: "0.3rem",
  },
  statValue: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "var(--brown-dark)",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "var(--brown-light)",
    marginTop: "0.15rem",
  },
  actionsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.65rem",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    padding: "0.85rem",
    background: "var(--cream-light)",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.06)",
    transition: "transform 0.2s",
  },
  actionIcon: {
    fontSize: "1.2rem",
  },
  actionLabel: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--brown-dark)",
  },
  activityCard: {
    background: "var(--cream-light)",
    borderRadius: "14px",
    padding: "0.5rem 0.85rem",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.06)",
  },
};

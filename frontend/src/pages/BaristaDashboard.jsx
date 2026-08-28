import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ActivityItem from "../components/ActivityItem";
import BottomNav from "../components/BottomNav";
import { DashboardSkeleton } from "../components/SkeletonLoader";
import uabLogo from "../assets/uabcafe-logo.jpg";

export default function BaristaDashboard() {
  const name = localStorage.getItem("name") || "Barista";
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/barista/stats").then((res) => setStats(res.data)).catch(() => {}),
      api.get("/barista/history").then((res) => setHistory(res.data.slice(0, 3))).catch(() => {}),
    ]).finally(() => setLoading(false));
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

  if (loading && !stats) return (
    <div style={styles.page}>
      <DashboardSkeleton />
      <BottomNav role="barista" />
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logoRow}>
              <img src={uabLogo} alt="uab" style={styles.logo} />
              <div>
                <p style={styles.greeting}>{getGreeting()}</p>
                <h1 style={styles.name}>{name}</h1>
              </div>
            </div>
            <span style={styles.baristaBadge}>Barista</span>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.avatar}>{getInitial(name)}</div>
            <button style={styles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Big Scan Button */}
        <button
          style={styles.scanCard}
          onClick={() => navigate("/barista/scan")}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(62, 39, 35, 0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(62, 39, 35, 0.25)"; }}
        >
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
              {[
                { icon: "👥", value: stats.total_customers, label: "Customers" },
                { icon: "⭐", value: stats.total_points, label: "Points" },
                { icon: "🎁", value: stats.total_rewards, label: "Rewards" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={styles.statCard}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <div style={styles.statIcon}>{stat.icon}</div>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionsRow}>
            {[
              { icon: "🔍", label: "Find Customer", path: "/barista/search" },
              { icon: "📜", label: "History", path: "/barista/history" },
            ].map((action) => (
              <button
                key={action.path}
                style={styles.actionBtn}
                onClick={() => navigate(action.path)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(62, 39, 35, 0.14)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(62, 39, 35, 0.08)"; }}
              >
                <span style={styles.actionIcon}>{action.icon}</span>
                <span style={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
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
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--gold)",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.15)",
  },
  greeting: {
    margin: 0,
    fontSize: "0.8rem",
    color: "var(--brown-light)",
  },
  name: {
    margin: "0.1rem 0 0",
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "var(--brown-dark)",
  },
  baristaBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "0.15rem 0.55rem",
    borderRadius: "8px",
    fontSize: "0.7rem",
    fontWeight: "600",
    color: "var(--burgundy)",
    background: "rgba(128, 0, 32, 0.08)",
    letterSpacing: "0.02em",
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
    background: "linear-gradient(145deg, rgba(62, 39, 35, 0.95), rgba(62, 39, 35, 0.88))",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "var(--cream)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    borderRadius: "18px",
    cursor: "pointer",
    marginBottom: "1.25rem",
    boxShadow: "0 6px 28px rgba(62, 39, 35, 0.25), inset 0 1px 0 rgba(212, 175, 55, 0.1)",
    textAlign: "left",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
    background: "rgba(255, 248, 231, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    padding: "0.85rem 0.5rem",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(62, 39, 35, 0.08)",
    border: "1px solid rgba(255, 248, 231, 0.5)",
    transition: "transform 0.2s ease",
    cursor: "default",
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
    background: "rgba(255, 248, 231, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    border: "1px solid rgba(255, 248, 231, 0.5)",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(62, 39, 35, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
    background: "rgba(255, 248, 231, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    borderRadius: "14px",
    padding: "0.5rem 0.85rem",
    boxShadow: "0 2px 10px rgba(62, 39, 35, 0.08)",
    border: "1px solid rgba(255, 248, 231, 0.5)",
  },
};

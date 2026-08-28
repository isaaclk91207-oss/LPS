import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CoffeeCup from "../components/CoffeeCup";
import TumblerCard from "../components/TumblerCard";
import ActivityItem from "../components/ActivityItem";
import BottomNav from "../components/BottomNav";
import AvatarStudio, { loadAvatarConfig } from "../components/AvatarStudio";
import { DashboardSkeleton } from "../components/SkeletonLoader";
import uabLogo from "../assets/uabcafe-logo.jpg";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";

  const loadData = useCallback(() => {
    setError("");
    setLoading(true);
    api.get("/customer/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard. Please try again."))
      .finally(() => setLoading(false));
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

  const getTierBadge = (points) => {
    if (points >= 50) return { label: "Gold Member", color: "var(--gold-bright)", bg: "rgba(212, 175, 55, 0.15)" };
    if (points >= 20) return { label: "Coffee Lover", color: "var(--brown-mid)", bg: "rgba(92, 58, 30, 0.1)" };
    return { label: "New Member", color: "var(--brown-light)", bg: "rgba(141, 110, 99, 0.1)" };
  };

  const handleSaveAvatar = (config) => {
    localStorage.setItem("uab_avatar", JSON.stringify(config));
    window.dispatchEvent(new Event("avatarUpdated"));
    setShowEditor(false);
  };

  if (error && !data) return (
    <div style={styles.page}>
      <div style={styles.errorCard}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryBtn} onClick={loadData}>Retry</button>
      </div>
    </div>
  );

  if (loading && !data) return (
    <div style={styles.page}>
      <DashboardSkeleton />
      <BottomNav role="customer" />
    </div>
  );

  const { customer, progress, history } = data;
  const tier = getTierBadge(customer.total_points);
  const recentActivity = history ? history.slice(0, 3) : [];

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
            <span style={{ ...styles.tierBadge, color: tier.color, background: tier.bg }}>
              {tier.label}
            </span>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.avatarContainer}>
              <AvatarStudio size={56} showEditButton={true} onOpenEditor={() => setShowEditor(true)} />
            </div>
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
                  <CoffeeCup filled={i < progress.coffee_progress} size={36} index={i} />
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
            {[
              { icon: "📱", label: "My QR", path: "/customer/qr" },
              { icon: "💰", label: "Points", path: "/customer/points" },
              { icon: "📜", label: "History", path: "/customer/history" },
            ].map((action) => (
              <button
                key={action.path}
                style={styles.actionCard}
                onClick={() => navigate(action.path)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(62, 39, 35, 0.14)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(62, 39, 35, 0.08)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              >
                <span style={styles.actionIcon}>{action.icon}</span>
                <span style={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
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

      {/* Avatar Editor Modal */}
      {showEditor && (
        <AvatarStudio.Editor
          currentConfig={loadAvatarConfig()}
          onClose={() => setShowEditor(false)}
          onSave={handleSaveAvatar}
        />
      )}
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
  tierBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "0.15rem 0.55rem",
    borderRadius: "8px",
    fontSize: "0.7rem",
    fontWeight: "600",
    letterSpacing: "0.02em",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatarContainer: {
    position: "relative",
    width: "56px",
    height: "56px",
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
    background: "linear-gradient(145deg, rgba(62, 39, 35, 0.95), rgba(62, 39, 35, 0.88))",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: "1.25rem",
    borderRadius: "20px",
    marginBottom: "1rem",
    color: "var(--cream)",
    boxShadow: "0 8px 32px rgba(62, 39, 35, 0.25), inset 0 1px 0 rgba(212, 175, 55, 0.1)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
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
    background: "rgba(255, 248, 231, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    borderRadius: "12px",
    padding: "0.85rem",
    border: "1px solid rgba(255, 248, 231, 0.5)",
  },
  stampGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "0.2rem",
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
    background: "linear-gradient(135deg, var(--gold), var(--gold-bright))",
    color: "var(--brown-dark)",
    padding: "0.6rem",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.85rem",
    marginTop: "0.85rem",
    animation: "pulse 2s ease-in-out infinite",
    boxShadow: "0 2px 12px rgba(212, 175, 55, 0.3)",
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
    fontSize: "1.4rem",
  },
  actionLabel: {
    fontSize: "0.75rem",
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
  errorCard: {
    background: "rgba(255, 248, 231, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    padding: "2rem",
    borderRadius: "16px",
    textAlign: "center",
    marginTop: "4rem",
    border: "1px solid rgba(255, 248, 231, 0.5)",
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

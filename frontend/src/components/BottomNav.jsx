import { useNavigate, useLocation } from "react-router-dom";

const customerTabs = [
  { path: "/customer/dashboard", label: "Home", icon: "🏠" },
  { path: "/customer/qr", label: "QR Code", icon: "📱" },
  { path: "/customer/points", label: "Points", icon: "💰" },
  { path: "/customer/history", label: "History", icon: "📜" },
];

const baristaTabs = [
  { path: "/barista/dashboard", label: "Home", icon: "🏠" },
  { path: "/barista/scan", label: "Scan", icon: "📷" },
  { path: "/barista/search", label: "Find", icon: "🔍" },
  { path: "/barista/history", label: "History", icon: "📜" },
];

export default function BottomNav({ role = "customer" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = role === "barista" ? baristaTabs : customerTabs;

  return (
    <div style={styles.container}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
            }}
            onClick={() => navigate(tab.path)}
          >
            <span style={{
              ...styles.icon,
              ...(isActive ? styles.iconActive : {}),
            }}>
              {tab.icon}
            </span>
            <span style={{
              ...styles.label,
              ...(isActive ? styles.labelActive : {}),
            }}>
              {tab.label}
            </span>
            {isActive && <span style={styles.activeIndicator} />}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "var(--brown-dark)",
    padding: "0.5rem 0",
    paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxShadow: "0 -4px 20px rgba(62, 39, 35, 0.2)",
    zIndex: 100,
  },
  tab: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.2rem",
    padding: "0.4rem 0.75rem",
    background: "none",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    minWidth: "60px",
    position: "relative",
  },
  tabActive: {
    background: "rgba(212, 165, 116, 0.2)",
  },
  icon: {
    fontSize: "1.3rem",
    lineHeight: 1,
    transition: "transform 0.2s ease",
  },
  iconActive: {
    transform: "scale(1.15)",
  },
  label: {
    fontSize: "0.7rem",
    color: "var(--brown-light)",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  labelActive: {
    color: "var(--gold)",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: "-2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "20px",
    height: "3px",
    borderRadius: "2px",
    background: "var(--gold)",
  },
};

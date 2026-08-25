export default function ActivityItem({ type, text, time, icon }) {
  const getIcon = () => {
    if (icon) return icon;
    if (type === "point") return "☕";
    if (type === "reward") return "🎁";
    return "📝";
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return time || "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconWrap}>{getIcon()}</div>
      <div style={styles.content}>
        <p style={styles.text}>{text}</p>
        <p style={styles.time}>{getTimeAgo(time)}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 0",
    borderBottom: "1px solid rgba(141, 110, 99, 0.15)",
  },
  iconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "var(--cream)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  text: {
    margin: 0,
    fontSize: "0.85rem",
    color: "var(--brown-dark)",
    fontWeight: "500",
  },
  time: {
    margin: "0.15rem 0 0",
    fontSize: "0.7rem",
    color: "var(--brown-light)",
  },
};

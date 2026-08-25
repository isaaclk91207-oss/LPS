import tumblerImg from "../assets/tumbler.jpg";

export default function TumblerCard({ progress = 0, max = 80, rewardAvailable = false }) {
  const percentage = Math.min((progress / max) * 100, 100);
  const remaining = max - progress;

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={tumblerImg} alt="UAB Tumbler" style={styles.image} />
      </div>
      <div style={styles.info}>
        <div style={styles.header}>
          <h3 style={styles.title}>Free UAB Tumbler</h3>
          <span style={styles.badge}>{progress}/{max}</span>
        </div>
        <p style={styles.pointsText}>points collected</p>
        <div style={styles.progressBg}>
          <div
            style={{
              ...styles.progressFill,
              width: `${percentage}%`,
            }}
          />
        </div>
        {rewardAvailable ? (
          <div style={styles.readyBadge}>Ready to Redeem!</div>
        ) : (
          <p style={styles.remaining}>{remaining} more to go</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "var(--cream-light)",
    padding: "1rem",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.08)",
  },
  imageContainer: {
    flexShrink: 0,
    width: "70px",
    height: "90px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "var(--white)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(62, 39, 35, 0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.15rem",
  },
  title: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--brown-dark)",
  },
  badge: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.15rem 0.5rem",
    borderRadius: "10px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  pointsText: {
    margin: "0 0 0.5rem",
    fontSize: "0.75rem",
    color: "var(--brown-light)",
  },
  progressBg: {
    width: "100%",
    height: "8px",
    background: "rgba(141, 110, 99, 0.2)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "0.4rem",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--brown-mid) 0%, var(--gold) 100%)",
    borderRadius: "4px",
    transition: "width 0.5s ease",
  },
  remaining: {
    margin: 0,
    fontSize: "0.75rem",
    color: "var(--brown-light)",
  },
  readyBadge: {
    display: "inline-block",
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.2rem 0.6rem",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
};

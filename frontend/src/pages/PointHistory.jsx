import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function PointHistory() {
  const [points, setPoints] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/customer/points")
      .then((res) => setPoints(res.data))
      .catch(() => setError("Failed to load point history."));
  }, []);

  if (error) return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>My Points</h1>
      </div>
        <div style={styles.card}><p style={styles.empty}>{error}</p></div>
    </div>
  );

  if (points === null) return <div style={styles.loading}>Loading...</div>;

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const formatTime = (d) => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>My Points</h1>
      </div>

      <div style={styles.summaryCard}>
        <span style={styles.summaryLabel}>Total Earned</span>
        <span style={styles.summaryValue}>{points.length} points</span>
      </div>

      <div style={styles.card}>
        {points.length === 0 ? (
          <p style={styles.empty}>No points earned yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Points</th>
                <th style={styles.th}>By</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.id}>
                  <td style={styles.td}>
                    <div>{formatDate(p.created_at)}</div>
                    <div style={styles.time}>{formatTime(p.created_at)}</div>
                  </td>
                  <td style={styles.td}>+{p.points}</td>
                  <td style={styles.td}>{p.barista_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  backBtn: {
    padding: "0.5rem 1rem",
    background: "var(--brown-light)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    color: "var(--brown-dark)",
    fontSize: "1.4rem",
  },
  summaryCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--brown-dark)",
    padding: "1rem 1.25rem",
    borderRadius: "14px",
    marginBottom: "1rem",
    color: "var(--cream)",
  },
  summaryLabel: {
    fontSize: "0.95rem",
  },
  summaryValue: {
    fontWeight: "700",
    fontSize: "1.1rem",
    color: "var(--gold)",
  },
  card: {
    background: "var(--cream-light)",
    padding: "1.25rem",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.08)",
  },
  empty: {
    textAlign: "center",
    color: "var(--brown-light)",
    padding: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "0.65rem 0.5rem",
    borderBottom: "2px solid var(--brown-light)",
    color: "var(--brown-dark)",
    fontSize: "0.85rem",
  },
  td: {
    padding: "0.65rem 0.5rem",
    borderBottom: "1px solid rgba(141, 110, 99, 0.2)",
  },
  time: {
    color: "var(--brown-light)",
    fontSize: "0.8rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "var(--brown-dark)",
  },
};

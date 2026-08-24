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

  if (points === null) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>Loading...</div>;

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const formatTime = (d) => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>My Points</h1>
      </div>

      <div style={styles.summary}>
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
    background: "#f0f2f5",
    padding: "1rem",
    maxWidth: "480px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  backBtn: {
    padding: "0.4rem 0.8rem",
    background: "#666",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    color: "#2d6a4f",
    fontSize: "1.25rem",
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "1rem 1.25rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "1rem",
  },
  summaryLabel: {
    color: "#666",
    fontSize: "0.95rem",
  },
  summaryValue: {
    color: "#2d6a4f",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  card: {
    background: "#fff",
    padding: "1.25rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  empty: {
    textAlign: "center",
    color: "#999",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "0.5rem",
    borderBottom: "2px solid #eee",
    color: "#2d6a4f",
  },
  td: {
    padding: "0.5rem",
    borderBottom: "1px solid #f0f0f0",
  },
  time: {
    color: "#999",
    fontSize: "0.8rem",
  },
};

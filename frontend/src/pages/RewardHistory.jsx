import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RewardHistory() {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/customer/dashboard")
      .then((res) => setHistory(res.data.history))
      .catch(() => setError("Failed to load reward history."));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  if (error) return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>Reward History</h1>
      </div>
      <div style={styles.card}><p style={styles.empty}>{error}</p></div>
    </div>
  );

  if (history === null) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>Reward History</h1>
      </div>

      <div style={styles.card}>
        {history.length === 0 ? (
          <p style={styles.empty}>No rewards redeemed yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Reward</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{formatDate(r.redeemed_at)}</td>
                  <td style={styles.td}>{r.reward_type === "coffee" ? "Free Coffee" : "Free Tumbler"}</td>
                  <td style={styles.td}>Redeemed</td>
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
};

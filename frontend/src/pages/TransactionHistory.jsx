import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function TransactionHistory() {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/barista/history")
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load transaction history."));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  if (error) return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/barista/dashboard")}>Back</button>
        <h1 style={styles.title}>Transaction History</h1>
      </div>
      <div style={styles.card}><p style={styles.empty}>{error}</p></div>
    </div>
  );

  if (history === null) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/barista/dashboard")}>Back</button>
        <h1 style={styles.title}>Transaction History</h1>
      </div>

      <div style={styles.card}>
        {history.length === 0 ? (
          <p style={styles.empty}>No transactions yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Reward</th>
                <th style={styles.th}>By</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{formatDate(r.redeemed_at)}</td>
                  <td style={styles.td}>{r.customer_name}</td>
                  <td style={styles.td}>{r.reward_type === "coffee" ? "Coffee" : "Tumbler"}</td>
                  <td style={styles.td}>{r.barista_name}</td>
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
    fontSize: "1.3rem",
  },
  card: {
    background: "var(--cream-light)",
    padding: "1.25rem",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.08)",
    overflowX: "auto",
  },
  empty: {
    textAlign: "center",
    color: "var(--brown-light)",
    padding: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "400px",
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
    fontSize: "0.9rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "var(--brown-dark)",
  },
};

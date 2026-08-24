import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CustomerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const search = useCallback((q) => {
    setLoading(true);
    api.get(`/barista/search?q=${encodeURIComponent(q)}`)
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/barista/dashboard")}>Back</button>
        <h1 style={styles.title}>Find Customer</h1>
      </div>

      <div style={styles.card}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name or code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div style={styles.card}>
        {loading ? (
          <p style={styles.empty}>Searching...</p>
        ) : results.length === 0 ? (
          <p style={styles.empty}>{query ? "No customers found." : "Type to search customers."}</p>
        ) : (
          <div style={styles.list}>
            {results.map((c) => (
              <div
                key={c.id}
                style={styles.listItem}
                onClick={() => navigate(`/barista/customer/${c.customer_code}`)}
              >
                <div style={styles.listLeft}>
                  <div style={styles.listName}>{c.name}</div>
                  <div style={styles.listCode}>{c.customer_code}</div>
                </div>
                <div style={styles.listRight}>
                  <span style={styles.pointsBadge}>{c.total_points} pts</span>
                </div>
              </div>
            ))}
          </div>
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
    color: "#1a5276",
    fontSize: "1.25rem",
  },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "1rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    padding: "1rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    background: "#fafafa",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
  },
  listLeft: {},
  listName: {
    fontWeight: "600",
    color: "#333",
    marginBottom: "0.15rem",
  },
  listCode: {
    color: "#888",
    fontSize: "0.85rem",
  },
  listRight: {},
  pointsBadge: {
    background: "#e8f5e9",
    color: "#2d6a4f",
    padding: "0.25rem 0.6rem",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
};

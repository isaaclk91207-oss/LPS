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

      <div style={styles.searchCard}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name or code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div style={styles.resultsCard}>
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
  searchCard: {
    background: "var(--cream-light)",
    padding: "0.75rem",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(62, 39, 35, 0.08)",
    marginBottom: "1rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.85rem 1rem",
    border: "2px solid var(--brown-light)",
    borderRadius: "10px",
    fontSize: "1rem",
    boxSizing: "border-box",
    background: "var(--white)",
  },
  resultsCard: {
    background: "var(--cream-light)",
    padding: "1rem",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.08)",
  },
  empty: {
    textAlign: "center",
    color: "var(--brown-light)",
    padding: "1.5rem",
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
    padding: "0.85rem",
    background: "var(--cream)",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  listLeft: {},
  listName: {
    fontWeight: "600",
    color: "var(--brown-dark)",
    marginBottom: "0.15rem",
  },
  listCode: {
    color: "var(--brown-light)",
    fontSize: "0.85rem",
  },
  listRight: {},
  pointsBadge: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.25rem 0.6rem",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
};

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import ToastContainer, { useToast } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CustomerDetail() {
  const { code } = useParams();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { toasts, addToast } = useToast();
  const navigate = useNavigate();

  const loadCustomer = useCallback(() => {
    setError("");
    api.get(`/barista/customer/${code}`)
      .then((res) => setCustomer(res.data))
      .catch(() => setError("Customer not found"));
  }, [code]);

  useEffect(loadCustomer, [loadCustomer]);

  const addPoint = () => {
    setConfirmAction({
      message: `Add 1 loyalty point to ${customer.name}?`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await api.post("/barista/point", { customer_code: code });
          addToast(`Point added! Total: ${res.data.progress.current_points}`);
          loadCustomer();
        } catch (err) {
          addToast(err.response?.data?.detail || "Failed to add point", "error");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const redeem = (type) => {
    const label = type === "coffee" ? "Free Coffee" : "Free Tumbler";
    setConfirmAction({
      message: `Redeem ${label} for ${customer.name}?`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await api.post("/barista/redeem", { customer_id: customer.id, reward_type: type });
          addToast(res.data.message);
          loadCustomer();
        } catch (err) {
          addToast(err.response?.data?.detail || "Failed to redeem", "error");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  if (error) return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/barista/scan")}>Back</button>
        <h1 style={styles.title}>Customer Detail</h1>
      </div>
      <div style={styles.card}>
        <p style={{ textAlign: "center", color: "#c62828" }}>{error}</p>
        <button style={styles.addPointBtn} onClick={loadCustomer}>Retry</button>
      </div>
    </div>
  );

  if (!customer) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <ToastContainer toasts={toasts} />
      {confirmAction && (
        <ConfirmDialog
          message={confirmAction.message}
          confirmLabel={actionLoading ? "Processing..." : "Confirm"}
          onConfirm={() => { confirmAction.onConfirm(); setConfirmAction(null); }}
          onCancel={() => { if (!actionLoading) setConfirmAction(null); }}
          disabled={actionLoading}
        />
      )}

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/barista/scan")}>Back</button>
        <h1 style={styles.title}>Customer Detail</h1>
      </div>

      <div style={styles.card}>
        <h2 style={styles.name}>{customer.name}</h2>
        <p style={styles.code}>{customer.customer_code}</p>
        <p style={styles.points}>Available Points: <strong>{customer.total_points}</strong></p>
      </div>

      {/* Coffee Reward */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Coffee Reward</h3>
          <span style={styles.badge}>{customer.coffee_progress}/10</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${(customer.coffee_progress / 10) * 100}%` }} />
        </div>
        {customer.coffee_reward_available && (
          <button style={styles.redeemBtn} onClick={() => redeem("coffee")}>Redeem Coffee</button>
        )}
      </div>

      {/* Tumbler Reward */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Tumbler Reward</h3>
          <span style={styles.badge}>{customer.tumbler_progress}/80</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${(customer.tumbler_progress / 80) * 100}%` }} />
        </div>
        {customer.tumbler_reward_available && (
          <button style={styles.redeemBtn} onClick={() => redeem("tumbler")}>Redeem Tumbler</button>
        )}
      </div>

      {/* Add Point */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Coffee Purchase</h3>
        <button style={styles.addPointBtn} onClick={addPoint}>+1 Point</button>
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
    padding: "1.25rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "1rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  name: {
    margin: 0,
    color: "#333",
  },
  code: {
    margin: "0.25rem 0 0.5rem",
    color: "#666",
  },
  points: {
    margin: 0,
    fontSize: "1.1rem",
  },
  cardTitle: {
    margin: 0,
    color: "#1a5276",
    fontSize: "1rem",
  },
  badge: {
    background: "#e8f5e9",
    color: "#2d6a4f",
    padding: "0.2rem 0.6rem",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  progressBarBg: {
    width: "100%",
    height: "12px",
    background: "#e0e0e0",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "0.75rem",
  },
  progressBarFill: {
    height: "100%",
    background: "#1a5276",
    borderRadius: "6px",
    transition: "width 0.3s",
  },
  redeemBtn: {
    width: "100%",
    padding: "0.6rem",
    background: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  addPointBtn: {
    width: "100%",
    padding: "0.75rem",
    background: "#1a5276",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
};

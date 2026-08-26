import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import ToastContainer, { useToast } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CustomerDetail() {
  const { code } = useParams();
  const location = useLocation();
  const [customer, setCustomer] = useState(location.state?.customer || null);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { toasts, addToast } = useToast();
  const navigate = useNavigate();

  const loadCustomer = useCallback(() => {
    if (customer) return;
    setError("");
    api.get(`/barista/customer/${code}`)
      .then((res) => setCustomer(res.data))
      .catch(() => setError("Customer not found"));
  }, [code, customer]);

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
        <p style={{ textAlign: "center", color: "var(--error)" }}>{error}</p>
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

      <div style={styles.infoCard}>
        <h2 style={styles.name}>{customer.name}</h2>
        <p style={styles.code}>{customer.customer_code}</p>
        <p style={styles.points}>Available Points: <strong>{customer.total_points}</strong></p>
      </div>

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
  infoCard: {
    background: "var(--brown-dark)",
    padding: "1.25rem 1.5rem",
    borderRadius: "14px",
    marginBottom: "1rem",
    color: "var(--cream)",
  },
  name: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  code: {
    margin: "0.25rem 0 0.75rem",
    color: "var(--brown-light)",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
  },
  points: {
    margin: 0,
    fontSize: "1rem",
  },
  card: {
    background: "var(--cream-light)",
    padding: "1.25rem",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.08)",
    marginBottom: "1rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  cardTitle: {
    margin: 0,
    color: "var(--brown-dark)",
    fontSize: "1rem",
  },
  badge: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.2rem 0.6rem",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  progressBarBg: {
    width: "100%",
    height: "10px",
    background: "rgba(141, 110, 99, 0.3)",
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "0.75rem",
  },
  progressBarFill: {
    height: "100%",
    background: "var(--brown-mid)",
    borderRadius: "5px",
    transition: "width 0.3s",
  },
  redeemBtn: {
    width: "100%",
    padding: "0.7rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  addPointBtn: {
    width: "100%",
    padding: "0.85rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "var(--brown-dark)",
  },
};

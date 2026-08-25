import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import api from "../api";

const QR_EXPIRY = 30;

export default function CustomerQR() {
  const [customer, setCustomer] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [countdown, setCountdown] = useState(QR_EXPIRY);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const fetchToken = useCallback(() => {
    api.get("/customer/qr-dynamic")
      .then((res) => {
        setQrToken(res.data.token);
        setCountdown(QR_EXPIRY);
        setError("");
      })
      .catch(() => setError("Failed to generate QR code."));
  }, []);

  const loadCustomer = useCallback(() => {
    api.get("/customer/me")
      .then((res) => setCustomer(res.data))
      .catch(() => setError("Failed to load customer info."));
  }, []);

  useEffect(() => {
    loadCustomer();
    fetchToken();
  }, [loadCustomer, fetchToken]);

  useEffect(() => {
    if (qrToken) {
      QRCode.toDataURL(qrToken, {
        width: 250,
        margin: 2,
        color: { dark: "#3E2723", light: "#ffffff" },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setError("Failed to render QR code."));
    }
  }, [qrToken]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchToken();
          return QR_EXPIRY;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [fetchToken]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `uab-cafe-${customer?.customer_code || "qr"}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (error && !customer) return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>My QR Code</h1>
      </div>
      <div style={styles.card}>
        <p style={{ color: "var(--error)", textAlign: "center" }}>{error}</p>
        <button style={styles.retryBtn} onClick={() => { loadCustomer(); fetchToken(); }}>Retry</button>
      </div>
    </div>
  );

  if (!customer) return <div style={styles.loading}>Loading...</div>;

  const progressPercent = ((QR_EXPIRY - countdown) / QR_EXPIRY) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/customer/dashboard")}>Back</button>
        <h1 style={styles.title}>My QR Code</h1>
      </div>

      <div style={styles.qrCard}>
        <div style={styles.brandBadge}>uab cafe</div>
        <h2 style={styles.name}>{customer.name}</h2>
        <p style={styles.code}>{customer.customer_code}</p>

        <div style={styles.qrWrapper}>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Loyalty QR Code" style={styles.qrImage} />
          ) : (
            <div style={styles.qrPlaceholder}>Generating QR...</div>
          )}
        </div>

        {/* Countdown Ring */}
        <div style={styles.countdownContainer}>
          <svg style={styles.countdownRing} viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--brown-light)" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2.5"
              strokeDasharray={`${100 - progressPercent}, 100`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s linear", transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          </svg>
          <span style={styles.countdownText}>{countdown}s</span>
        </div>

        <p style={styles.instruction}>
          Auto-refreshes every {QR_EXPIRY} seconds
        </p>

        {error && <p style={styles.errorText}>{error}</p>}

        <button style={styles.downloadBtn} onClick={downloadQR} disabled={!qrDataUrl}>
          Download QR Code
        </button>
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
    fontSize: "0.9rem",
  },
  title: {
    margin: 0,
    color: "var(--brown-dark)",
    fontSize: "1.4rem",
  },
  qrCard: {
    background: "var(--brown-dark)",
    padding: "2rem 1.5rem",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(62, 39, 35, 0.2)",
    textAlign: "center",
    color: "var(--cream)",
  },
  brandBadge: {
    display: "inline-block",
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.35rem 1.25rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "0.15em",
    marginBottom: "1rem",
  },
  name: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: "600",
  },
  code: {
    margin: "0.25rem 0 1.5rem",
    color: "var(--brown-light)",
    fontSize: "0.9rem",
    letterSpacing: "0.1em",
  },
  qrWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1.25rem",
    padding: "1rem",
    background: "var(--white)",
    borderRadius: "16px",
    minHeight: "280px",
  },
  qrImage: {
    display: "block",
    width: "250px",
    height: "250px",
  },
  qrPlaceholder: {
    color: "var(--brown-light)",
    fontSize: "0.9rem",
  },
  countdownContainer: {
    position: "relative",
    width: "52px",
    height: "52px",
    margin: "0 auto 0.75rem",
  },
  countdownRing: {
    width: "100%",
    height: "100%",
  },
  countdownText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "var(--gold)",
  },
  instruction: {
    color: "var(--brown-light)",
    fontSize: "0.8rem",
    marginBottom: "1.25rem",
    lineHeight: 1.4,
  },
  errorText: {
    color: "var(--error)",
    fontSize: "0.85rem",
    marginBottom: "0.75rem",
  },
  downloadBtn: {
    width: "100%",
    padding: "0.85rem",
    background: "var(--cream)",
    color: "var(--brown-dark)",
    border: "none",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  retryBtn: {
    marginTop: "1rem",
    padding: "0.7rem 2rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "var(--brown-dark)",
  },
  card: {
    background: "var(--cream-light)",
    padding: "2rem",
    borderRadius: "16px",
    textAlign: "center",
  },
};

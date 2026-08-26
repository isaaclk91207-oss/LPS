import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api";

export default function QRScanner() {
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const navigate = useNavigate();

  const handleDecodedText = async (decodedText) => {
    console.log("Decoded text:", decodedText);

    if (processingRef.current) return;
    processingRef.current = true;

    let code = decodedText.trim();

    if (code.startsWith("{")) {
      try {
        const parsed = JSON.parse(code);
        code = parsed.token || parsed.customer_code || parsed.code || "";
      } catch {}
    }

    setScannedCode("Verifying...");
    try {
      const res = await api.post("/barista/scan", { customer_code: code });
      if (res.data) {
        stopScanner();
        navigate(`/barista/customer/${res.data.customer_code}`, {
          state: { customer: res.data },
          replace: true,
        });
        return;
      }
    } catch (err) {
      console.error("Scan Navigation Error:", err);
      const detail = err.response?.data?.detail || "Scan failed";
      setError(detail);
    }

    processingRef.current = false;
    setScannedCode("");
  };

  const startScanner = async () => {
    processingRef.current = false;
    setError("");
    setScannedCode("");
    setScanning(true);

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
        (decodedText) => handleDecodedText(decodedText),
        () => {}
      );
    } catch (err) {
      setScanning(false);
      if (err.toString().includes("NotAllowedError")) {
        setError("Camera access denied. Please allow camera permissions.");
      } else if (err.toString().includes("NotFoundError")) {
        setError("No camera found. Use manual entry below.");
      } else {
        setError("Could not start camera. Use manual entry below.");
      }
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = manualCode.trim().toUpperCase();
    if (!code) return;
    if (!/^CUS-\d{3}$/i.test(code)) {
      setError("Invalid code format. Use: CUS-001");
      return;
    }
    stopScanner();
    navigate(`/barista/customer/${code}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => { stopScanner(); navigate("/barista/dashboard"); }}>Back</button>
        <h1 style={styles.title}>Scan Customer QR</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {scannedCode && <div style={styles.successBanner}>{scannedCode}</div>}

      <div style={styles.card}>
        <div style={styles.scannerContainer}>
          <div id="qr-reader" style={styles.qrReader} />
          {scanning && (
            <div style={styles.scanOverlay}>
              <div style={styles.scanFrame}>
                <div style={styles.cornerTL} />
                <div style={styles.cornerTR} />
                <div style={styles.cornerBL} />
                <div style={styles.cornerBR} />
              </div>
              <p style={styles.scanHint}>Align QR code within the frame</p>
            </div>
          )}
        </div>
        {!scanning ? (
          <button style={styles.scanBtn} onClick={startScanner}>Start Camera</button>
        ) : (
          <button style={styles.stopBtn} onClick={stopScanner}>Stop Camera</button>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or enter code manually</span>
          <span style={styles.dividerLine} />
        </div>
        <form onSubmit={handleManualSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. CUS-001"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />
          <button style={styles.lookupBtn} type="submit">Look Up Customer</button>
        </form>
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
  error: {
    background: "#FFEBEE",
    color: "var(--error)",
    padding: "0.75rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  successBanner: {
    background: "var(--gold)",
    color: "var(--brown-dark)",
    padding: "0.75rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "600",
  },
  card: {
    background: "var(--cream-light)",
    padding: "1.25rem",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.08)",
    marginBottom: "1rem",
  },
  scannerContainer: {
    position: "relative",
    width: "100%",
    marginBottom: "1rem",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#1a1a1a",
  },
  qrReader: {
    width: "100%",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  scanFrame: {
    width: "220px",
    height: "220px",
    position: "relative",
  },
  cornerTL: { position: "absolute", top: 0, left: 0, width: "30px", height: "30px", borderTop: "3px solid var(--gold)", borderLeft: "3px solid var(--gold)", borderRadius: "4px 0 0 0" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: "30px", height: "30px", borderTop: "3px solid var(--gold)", borderRight: "3px solid var(--gold)", borderRadius: "0 4px 0 0" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: "30px", height: "30px", borderBottom: "3px solid var(--gold)", borderLeft: "3px solid var(--gold)", borderRadius: "0 0 0 4px" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: "30px", height: "30px", borderBottom: "3px solid var(--gold)", borderRight: "3px solid var(--gold)", borderRadius: "0 0 4px 0" },
  scanHint: {
    color: "#fff",
    fontSize: "0.8rem",
    marginTop: "0.75rem",
    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  scanBtn: {
    width: "100%",
    padding: "0.85rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  stopBtn: {
    width: "100%",
    padding: "0.85rem",
    background: "var(--error)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "var(--brown-light)",
  },
  dividerText: {
    color: "var(--brown-light)",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  input: {
    width: "100%",
    padding: "0.85rem",
    marginBottom: "0.85rem",
    border: "2px solid var(--brown-light)",
    borderRadius: "10px",
    fontSize: "1.1rem",
    textAlign: "center",
    boxSizing: "border-box",
    letterSpacing: "0.1em",
    fontWeight: "bold",
    background: "var(--white)",
  },
  lookupBtn: {
    width: "100%",
    padding: "0.85rem",
    background: "var(--brown-dark)",
    color: "var(--cream)",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

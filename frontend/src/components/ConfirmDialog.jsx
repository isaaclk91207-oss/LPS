import { useEffect } from "react";

export default function ConfirmDialog({ message, confirmLabel = "Confirm", onConfirm, onCancel, disabled = false }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !disabled) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel, disabled]);

  return (
    <div style={styles.overlay} onClick={disabled ? undefined : onCancel}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button
            style={disabled ? { ...styles.cancelBtn, opacity: 0.5 } : styles.cancelBtn}
            onClick={disabled ? undefined : onCancel}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            style={disabled ? { ...styles.confirmBtn, opacity: 0.7 } : styles.confirmBtn}
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  dialog: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "340px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
  message: {
    fontSize: "1rem",
    color: "#333",
    textAlign: "center",
    marginBottom: "1.25rem",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
  },
  cancelBtn: {
    flex: 1,
    padding: "0.6rem",
    background: "#f5f5f5",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    padding: "0.6rem",
    background: "#1a5276",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

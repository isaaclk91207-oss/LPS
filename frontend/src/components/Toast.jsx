import { useState, useCallback } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, fading: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2700);
  }, []);

  return { toasts, addToast };
}

export default function ToastContainer({ toasts }) {
  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            ...(t.type === "error" ? styles.error : t.type === "info" ? styles.info : styles.success),
            animation: t.fading ? "fadeOut 0.3s ease-out forwards" : "fadeIn 0.2s ease-in",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "90%",
    maxWidth: "400px",
  },
  toast: {
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    color: "var(--cream)",
    fontSize: "0.95rem",
    boxShadow: "0 4px 16px rgba(62, 39, 35, 0.2)",
    textAlign: "center",
  },
  success: {
    background: "var(--brown-dark)",
  },
  error: {
    background: "var(--error)",
  },
  info: {
    background: "var(--brown-mid)",
  },
};

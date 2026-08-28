export function SkeletonCard({ style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        background: "var(--cream-light)",
        padding: "1.25rem",
        borderRadius: "16px",
        marginBottom: "1rem",
        ...style,
      }}
    >
      <div className="skeleton" style={{ height: "14px", width: "40%", marginBottom: "0.75rem", borderRadius: "6px" }} />
      <div className="skeleton" style={{ height: "10px", width: "100%", marginBottom: "0.5rem", borderRadius: "6px" }} />
      <div className="skeleton" style={{ height: "10px", width: "70%", borderRadius: "6px" }} />
    </div>
  );
}

export function SkeletonCircle({ size = 42, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function SkeletonRect({ width = "100%", height = "10px", style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: "6px",
        ...style,
      }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <SkeletonRect width="120px" height="12px" style={{ marginBottom: "0.4rem" }} />
          <SkeletonRect width="160px" height="20px" />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <SkeletonCircle size={42} />
          <SkeletonRect width="60px" height="30px" style={{ borderRadius: "8px" }} />
        </div>
      </div>

      <div className="skeleton" style={{ height: "180px", borderRadius: "20px", marginBottom: "1rem" }} />
      <div className="skeleton" style={{ height: "110px", borderRadius: "16px", marginBottom: "1rem" }} />

      <SkeletonRect width="100px" height="14px" style={{ marginBottom: "0.65rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "14px" }} />
        ))}
      </div>
    </div>
  );
}

export function CustomerDetailSkeleton() {
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
        <SkeletonRect width="70px" height="36px" style={{ borderRadius: "8px" }} />
        <SkeletonRect width="160px" height="20px" />
      </div>

      <div className="skeleton" style={{ height: "100px", borderRadius: "14px", marginBottom: "1rem" }} />

      {[1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "14px", marginBottom: "1rem" }} />
      ))}

      <div className="skeleton" style={{ height: "70px", borderRadius: "14px" }} />
    </div>
  );
}

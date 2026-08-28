import { useState, useEffect } from "react";

export default function CoffeeCup({ filled = false, size = 40, index = 0 }) {
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (filled) {
      const timer = setTimeout(() => setShowGlow(true), index * 80);
      return () => clearTimeout(timer);
    }
  }, [filled, index]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size + 8}px`,
        height: `${size + 8}px`,
        borderRadius: "50%",
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        animation: filled ? `stampAppear 0.4s ease ${index * 0.06}s both` : "none",
        boxShadow: showGlow ? "0 0 14px rgba(212, 175, 55, 0.55), 0 0 6px rgba(128, 0, 32, 0.2)" : "none",
        cursor: "default",
        background: filled ? "rgba(212, 175, 55, 0.08)" : "transparent",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: filled
            ? "drop-shadow(0 2px 4px rgba(128, 0, 32, 0.25)) drop-shadow(0 0 4px rgba(212, 175, 55, 0.3))"
            : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {/* Cup body */}
        <path
          d="M12 20h32v28c0 4-4 8-8 8H20c-4 0-8-4-8-8V20z"
          fill={filled ? "var(--brown-mid)" : "transparent"}
          stroke={filled ? "var(--burgundy)" : "var(--brown-light)"}
          strokeWidth="3"
          strokeLinejoin="round"
          opacity={filled ? 1 : 0.5}
        />
        {/* Handle */}
        <path
          d="M44 26h6c4 0 8 4 8 8s-4 8-8 8h-6"
          stroke={filled ? "var(--burgundy)" : "var(--brown-light)"}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity={filled ? 1 : 0.5}
        />
        {/* Heart decoration (shown when filled) */}
        {filled && (
          <path
            d="M22 32c0-2 2-4 4-4s3 1 3 3c0-2 1-3 3-3s4 2 4 4c0 4-7 8-7 8s-7-4-7-8z"
            fill="var(--cream)"
          />
        )}
        {/* Steam lines (shown when filled) */}
        {filled && (
          <>
            <path
              d="M24 12c0-3 4-3 4 0"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              style={{ animation: "steamFloat 2s ease-in-out infinite" }}
            />
            <path
              d="M32 10c0-3 4-3 4 0"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              style={{ animation: "steamFloat 2s ease-in-out 0.4s infinite" }}
            />
          </>
        )}
        {/* Empty cup hand-drawn doodle elements */}
        {!filled && (
          <>
            {/* Dashed inner circle placeholder */}
            <circle
              cx="28"
              cy="36"
              r="7"
              fill="none"
              stroke="var(--brown-light)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.35"
            />
            {/* Tiny question mark */}
            <text
              x="28"
              y="39"
              textAnchor="middle"
              fill="var(--brown-light)"
              fontSize="8"
              fontFamily="serif"
              opacity="0.3"
            >?</text>
            {/* Faint steam wisps */}
            <path
              d="M22 14c0-2 2-2 2 0"
              stroke="var(--brown-light)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              opacity="0.2"
            />
            <path
              d="M28 12c0-2 2-2 2 0"
              stroke="var(--brown-light)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              opacity="0.15"
            />
          </>
        )}
      </svg>
    </div>
  );
}

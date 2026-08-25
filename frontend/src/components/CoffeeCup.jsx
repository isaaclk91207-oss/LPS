export default function CoffeeCup({ filled = false, size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cup body */}
      <path
        d="M12 20h32v28c0 4-4 8-8 8H20c-4 0-8-4-8-8V20z"
        fill={filled ? "#5C3A1E" : "transparent"}
        stroke="#5C3A1E"
        strokeWidth="3"
      />
      {/* Handle */}
      <path
        d="M44 26h6c4 0 8 4 8 8s-4 8-8 8h-6"
        stroke="#5C3A1E"
        strokeWidth="3"
        fill="none"
      />
      {/* Heart decoration (shown when filled) */}
      {filled && (
        <path
          d="M22 32c0-2 2-4 4-4s3 1 3 3c0-2 1-3 3-3s4 2 4 4c0 4-7 8-7 8s-7-4-7-8z"
          fill="#F5E6C8"
        />
      )}
      {/* Steam lines (shown when filled) */}
      {filled && (
        <>
          <path d="M24 12c0-3 4-3 4 0" stroke="#8D6E63" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M32 10c0-3 4-3 4 0" stroke="#8D6E63" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

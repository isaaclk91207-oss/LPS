import { useState, useEffect } from "react";

const DEFAULT_AVATAR = { base: "girl", outfit: "cardigan_purple", item: "unicorn" };

export function loadAvatarConfig() {
  try {
    const saved = localStorage.getItem("uab_avatar");
    if (!saved) return DEFAULT_AVATAR;
    const config = JSON.parse(saved);
    if (config.outfit === "cardigan") config.outfit = "cardigan_purple";
    if (config.outfit === "jacket") config.outfit = "varsity";
    if (config.outfit === "apron") config.outfit = "cardigan_cream";
    if (config.item === "tumbler" || config.item === "mug") config.item = "none";
    return config;
  } catch {
    return DEFAULT_AVATAR;
  }
}

const BASES = [
  { id: "girl", label: "Girl" },
  { id: "boy", label: "Boy" },
];

const OUTFITS = [
  { id: "varsity", label: "uabpay Varsity", color: "#1A1A1A", type: "jacket" },
  { id: "cardigan_purple", label: "Purple", color: "#9B7FD4", type: "cardigan" },
  { id: "cardigan_green", label: "Green", color: "#A8D98A", type: "cardigan" },
  { id: "cardigan_grey", label: "Grey", color: "#6B6B6B", type: "cardigan" },
  { id: "cardigan_black", label: "Black", color: "#2A2A2A", type: "cardigan" },
  { id: "cardigan_cream", label: "Cream", color: "#F5F0E8", type: "cardigan" },
];

const ITEMS = [
  { id: "none", label: "None", emoji: "❌" },
  { id: "unicorn", label: "uab Unicorn", emoji: "🦄" },
];

/* ── Base Characters ── */

function GirlBase() {
  return (
    <g>
      <circle cx="50" cy="30" r="28" fill="#5C3A1E" />
      <circle cx="50" cy="35" r="23" fill="#F5CBA7" />
      <circle cx="28" cy="18" r="9" fill="#5C3A1E" />
      <circle cx="72" cy="18" r="9" fill="#5C3A1E" />
      <circle cx="28" cy="18" r="5" fill="#4A2E1A" />
      <circle cx="72" cy="18" r="5" fill="#4A2E1A" />
      <circle cx="40" cy="34" r="3.5" fill="#3E2723" />
      <circle cx="60" cy="34" r="3.5" fill="#3E2723" />
      <circle cx="41.5" cy="32.5" r="1.2" fill="#fff" />
      <circle cx="61.5" cy="32.5" r="1.2" fill="#fff" />
      <ellipse cx="33" cy="40" rx="4" ry="2.5" fill="#E8A0A0" opacity="0.5" />
      <ellipse cx="67" cy="40" rx="4" ry="2.5" fill="#E8A0A0" opacity="0.5" />
      <path d="M45 44 Q50 49 55 44" stroke="#C62828" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function BoyBase() {
  return (
    <g>
      <circle cx="50" cy="30" r="28" fill="#3E2723" />
      <circle cx="50" cy="35" r="23" fill="#D4A574" />
      <path d="M28 30 Q35 8 50 12 Q65 8 72 30" fill="#3E2723" />
      <ellipse cx="50" cy="14" rx="12" ry="6" fill="#3E2723" />
      <circle cx="40" cy="34" r="3.5" fill="#3E2723" />
      <circle cx="60" cy="34" r="3.5" fill="#3E2723" />
      <circle cx="41.5" cy="32.5" r="1.2" fill="#fff" />
      <circle cx="61.5" cy="32.5" r="1.2" fill="#fff" />
      <ellipse cx="33" cy="40" rx="4" ry="2.5" fill="#D4956A" opacity="0.4" />
      <ellipse cx="67" cy="40" rx="4" ry="2.5" fill="#D4956A" opacity="0.4" />
      <path d="M44 44 Q50 48 56 44" stroke="#C62828" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

/* ── Outfits ── */

function uabLogoOnChest({ x = 38, y = 63, color = "#fff" }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.5" fill={color} opacity="0.9" />
      {/* Simplified unicorn head silhouette */}
      <path d={`M${x-1.2} ${y+1.5} Q${x} ${y-1} ${x+1.2} ${y+1.5} Q${x} ${y+2.8} ${x-1.2} ${y+1.5}Z`} fill="rgba(0,0,0,0.25)" />
      <line x1={x} y1={y-1.5} x2={x+0.8} y2={y-3} stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
    </g>
  );
}

function CardiganOutfit({ color = "#9B7FD4" }) {
  const textColor = color === "#F5F0E8" || color === "#A8D98A" ? "#3E2723" : "#fff";
  return (
    <g>
      <path d="M30 62 Q30 55 50 55 Q70 55 70 62 L70 95 Q70 100 65 100 L35 100 Q30 100 30 95 Z" fill={color} />
      <path d="M42 55 L50 70 L58 55" fill="#F5CBA7" />
      <circle cx="50" cy="76" r="1.5" fill={textColor} opacity="0.6" />
      <circle cx="50" cy="84" r="1.5" fill={textColor} opacity="0.6" />
      <circle cx="50" cy="92" r="1.5" fill={textColor} opacity="0.6" />
      <uabLogoOnChest x={38} y={63} color={textColor} />
      <path d="M30 62 L18 75 L22 78 L30 68" fill={color} />
      <path d="M70 62 L82 75 L78 78 L70 68" fill={color} />
    </g>
  );
}

function VarsityOutfit() {
  return (
    <g>
      {/* Body */}
      <path d="M30 62 Q30 55 50 55 Q70 55 70 62 L70 95 Q70 100 65 100 L35 100 Q30 100 30 95 Z" fill="#1A1A1A" />
      {/* Collar - purple/white stripes */}
      <path d="M38 55 L32 65 L42 62 Z" fill="#1A1A1A" />
      <path d="M62 55 L68 65 L58 62 Z" fill="#1A1A1A" />
      <line x1="36" y1="57" x2="42" y2="60" stroke="#9B7FD4" strokeWidth="1.2" />
      <line x1="35" y1="59" x2="41" y2="62" stroke="#fff" strokeWidth="0.8" />
      <line x1="64" y1="57" x2="58" y2="60" stroke="#9B7FD4" strokeWidth="1.2" />
      <line x1="65" y1="59" x2="59" y2="62" stroke="#fff" strokeWidth="0.8" />
      {/* Zipper */}
      <line x1="50" y1="58" x2="50" y2="98" stroke="#555" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="48" y="58" width="4" height="3" rx="1" fill="#888" />
      {/* Cuffs - purple/white stripes */}
      <rect x="16" y="74" width="8" height="5" rx="1" fill="#1A1A1A" />
      <line x1="16" y1="76" x2="24" y2="76" stroke="#9B7FD4" strokeWidth="0.8" />
      <line x1="16" y1="78" x2="24" y2="78" stroke="#fff" strokeWidth="0.6" />
      <rect x="76" y="74" width="8" height="5" rx="1" fill="#1A1A1A" />
      <line x1="76" y1="76" x2="84" y2="76" stroke="#9B7FD4" strokeWidth="0.8" />
      <line x1="76" y1="78" x2="84" y2="78" stroke="#fff" strokeWidth="0.6" />
      {/* Hem stripes */}
      <line x1="35" y1="97" x2="65" y2="97" stroke="#9B7FD4" strokeWidth="1" />
      <line x1="35" y1="99" x2="65" y2="99" stroke="#fff" strokeWidth="0.7" />
      {/* uabpay logo on chest */}
      <circle cx="40" cy="66" r="3" fill="#2E7D32" />
      <text x="40" y="67.5" textAnchor="middle" fill="#fff" fontSize="2.5" fontWeight="bold">P</text>
      <text x="40" y="72" textAnchor="middle" fill="#ccc" fontSize="2.2" fontWeight="600">uabpay</text>
      {/* Sleeves */}
      <path d="M30 62 L16 76 L20 80 L30 68" fill="#1A1A1A" />
      <path d="M70 62 L84 76 L80 80 L70 68" fill="#1A1A1A" />
    </g>
  );
}

/* ── Items ── */

function UnicornItem() {
  return (
    <g transform="translate(68, 62) scale(0.6)">
      {/* Body - white chubby */}
      <ellipse cx="22" cy="32" rx="18" ry="14" fill="#FFFFFF" stroke="#E8E0D8" strokeWidth="0.5" />
      {/* Head */}
      <ellipse cx="28" cy="16" rx="14" ry="12" fill="#FFFFFF" stroke="#E8E0D8" strokeWidth="0.5" />
      {/* Pink ears */}
      <path d="M18 6 L16 -2 L22 4 Z" fill="#F8BBD0" />
      <path d="M34 6 L36 -2 L30 4 Z" fill="#F8BBD0" />
      {/* Pink horn */}
      <path d="M26 2 L28 -6 L24 -2 Z" fill="#F48FB1" />
      {/* Closed eyes with eyelashes */}
      <path d="M22 14 Q24 16 26 14" stroke="#3E2723" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <line x1="22" y1="14" x2="21" y2="12.5" stroke="#3E2723" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="24" y1="15" x2="23.5" y2="13.5" stroke="#3E2723" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M30 14 Q32 16 34 14" stroke="#3E2723" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <line x1="34" y1="14" x2="35" y2="12.5" stroke="#3E2723" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="32" y1="15" x2="32.5" y2="13.5" stroke="#3E2723" strokeWidth="0.7" strokeLinecap="round" />
      {/* Pink cheek */}
      <circle cx="36" cy="18" r="2.5" fill="#E57373" opacity="0.5" />
      {/* Nostrils */}
      <circle cx="26" cy="20" r="0.8" fill="#BDBDBD" />
      <circle cx="30" cy="20" r="0.8" fill="#BDBDBD" />
      {/* "Hey Uab" embroidery on belly */}
      <text x="22" y="32" textAnchor="middle" fill="#9E9E9E" fontSize="3" fontWeight="600" fontStyle="italic">Hey</text>
      <text x="22" y="36" textAnchor="middle" fill="#9E9E9E" fontSize="3.5" fontWeight="700">Uab</text>
      {/* Pink paws */}
      <ellipse cx="10" cy="42" rx="5" ry="4" fill="#F8BBD0" />
      <ellipse cx="34" cy="42" rx="5" ry="4" fill="#F8BBD0" />
      {/* Pink feet */}
      <ellipse cx="14" cy="46" rx="4" ry="3" fill="#F8BBD0" />
      <ellipse cx="30" cy="46" rx="4" ry="3" fill="#F8BBD0" />
    </g>
  );
}

/* ── Avatar Renderer ── */

const OUTFIT_MAP = {
  varsity: VarsityOutfit,
  cardigan_purple: (props) => <CardiganOutfit color="#9B7FD4" />,
  cardigan_green: (props) => <CardiganOutfit color="#A8D98A" />,
  cardigan_grey: (props) => <CardiganOutfit color="#6B6B6B" />,
  cardigan_black: (props) => <CardiganOutfit color="#2A2A2A" />,
  cardigan_cream: (props) => <CardiganOutfit color="#F5F0E8" />,
};

function AvatarSVG({ config, size = 56 }) {
  const Base = config.base === "boy" ? BoyBase : GirlBase;
  const Outfit = OUTFIT_MAP[config.outfit] || ((props) => <CardiganOutfit color="#9B7FD4" />);
  const showUnicorn = config.item === "unicorn";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%" }}
    >
      <circle cx="50" cy="50" r="50" fill="var(--cream-light)" />
      <circle cx="50" cy="50" r="48" fill="var(--brown-dark)" opacity="0.08" />
      <g>
        <Outfit />
        <Base />
        {showUnicorn && <UnicornItem />}
      </g>
    </svg>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={styles.editBtn}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      🎨
    </button>
  );
}

/* ── Editor Drawer ── */

function Editor({ currentConfig, onClose, onSave }) {
  const [config, setConfig] = useState(currentConfig);
  const [activeTab, setActiveTab] = useState("base");

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const tabs = [
    { id: "base", label: "Character" },
    { id: "outfit", label: "Outfit" },
    { id: "item", label: "Accessory" },
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.handleBar}>
          <div style={styles.handle} />
        </div>

        {/* Preview */}
        <div style={styles.previewArea}>
          <div style={styles.previewRing}>
            <AvatarSVG config={config} size={120} />
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={activeTab === tab.id ? { ...styles.tab, ...styles.tabActive } : styles.tab}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Character Tab */}
        {activeTab === "base" && (
          <div style={styles.optionsGrid}>
            {BASES.map((opt) => {
              const isSelected = config.base === opt.id;
              return (
                <button
                  key={opt.id}
                  style={isSelected ? { ...styles.optionBtn, ...styles.optionSelected } : styles.optionBtn}
                  onClick={() => update("base", opt.id)}
                >
                  <div style={styles.basePreview}>
                    <AvatarSVG config={{ ...config, base: opt.id }} size={64} />
                  </div>
                  <span style={styles.optionLabel}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Outfit Tab */}
        {activeTab === "outfit" && (
          <div>
            {/* Cardigan Section */}
            <p style={styles.sectionLabel}>uab Cardigans</p>
            <div style={styles.colorRow}>
              {OUTFITS.filter((o) => o.type === "cardigan").map((opt) => {
                const isSelected = config.outfit === opt.id;
                return (
                  <button
                    key={opt.id}
                    style={isSelected
                      ? { ...styles.colorBtn, background: opt.color, ...styles.colorSelected }
                      : { ...styles.colorBtn, background: opt.color }
                    }
                    onClick={() => update("outfit", opt.id)}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.transform = "scale(1.1)"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {isSelected && <span style={styles.checkMark}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Varsity Jacket Section */}
            <p style={styles.sectionLabel}>uabpay Varsity Jacket</p>
            <div style={styles.optionsGrid}>
              {OUTFITS.filter((o) => o.type === "jacket").map((opt) => {
                const isSelected = config.outfit === opt.id;
                return (
                  <button
                    key={opt.id}
                    style={isSelected ? { ...styles.optionBtn, ...styles.optionSelected } : styles.optionBtn}
                    onClick={() => update("outfit", opt.id)}
                  >
                    <div style={{ ...styles.optionSwatch, background: opt.color, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: "2px", left: "2px", right: "2px", height: "3px", borderRadius: "1px", background: "linear-gradient(90deg, #9B7FD4 50%, #fff 50%)" }} />
                      <div style={{ position: "absolute", bottom: "2px", left: "2px", right: "2px", height: "3px", borderRadius: "1px", background: "linear-gradient(90deg, #9B7FD4 50%, #fff 50%)" }} />
                    </div>
                    <span style={styles.optionLabel}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Accessory Tab */}
        {activeTab === "item" && (
          <div style={styles.optionsGrid}>
            {ITEMS.map((opt) => {
              const isSelected = config.item === opt.id;
              return (
                <button
                  key={opt.id}
                  style={isSelected ? { ...styles.optionBtn, ...styles.optionSelected } : styles.optionBtn}
                  onClick={() => update("item", opt.id)}
                >
                  <span style={styles.optionEmoji}>{opt.emoji}</span>
                  <span style={styles.optionLabel}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>Close</button>
          <button
            style={styles.saveBtn}
            onClick={() => onSave(config)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Save Outfit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Export ── */

export default function AvatarStudio({ size = 56, showEditButton = false, onOpenEditor }) {
  const [config, setConfig] = useState(() => loadAvatarConfig());

  useEffect(() => {
    const handler = () => setConfig(loadAvatarConfig());
    window.addEventListener("avatarUpdated", handler);
    return () => window.removeEventListener("avatarUpdated", handler);
  }, []);

  return (
    <div style={{ ...styles.displayContainer, width: `${size}px`, height: `${size}px` }}>
      <AvatarSVG config={config} size={size} />
      {showEditButton && <EditButton onClick={onOpenEditor} />}
    </div>
  );
}

AvatarStudio.Editor = Editor;

/* ── Styles ── */

const styles = {
  displayContainer: {
    position: "relative",
    borderRadius: "50%",
    flexShrink: 0,
  },
  editBtn: {
    position: "absolute",
    bottom: "-2px",
    right: "-6px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "var(--gold)",
    border: "2px solid var(--cream)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(62, 39, 35, 0.25)",
    transition: "transform 0.2s ease",
    padding: 0,
    lineHeight: 1,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 10000,
    animation: "fadeIn 0.2s ease-in",
  },
  sheet: {
    width: "100%",
    maxWidth: "480px",
    maxHeight: "92vh",
    background: "linear-gradient(180deg, rgba(62, 39, 35, 0.97), rgba(62, 39, 35, 0.99))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px 24px 0 0",
    padding: "0 1.25rem 1.5rem",
    boxShadow: "0 -8px 40px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    borderBottom: "none",
    overflowY: "auto",
    animation: "overlaySlideIn 0.3s ease-out",
  },
  handleBar: {
    display: "flex",
    justifyContent: "center",
    padding: "0.75rem 0 0.5rem",
  },
  handle: {
    width: "36px",
    height: "4px",
    borderRadius: "2px",
    background: "rgba(212, 165, 116, 0.4)",
  },
  previewArea: {
    display: "flex",
    justifyContent: "center",
    padding: "1rem 0",
  },
  previewRing: {
    width: "132px",
    height: "132px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--gold), var(--gold-bright), var(--gold))",
    padding: "6px",
    boxShadow: "0 4px 20px rgba(212, 175, 55, 0.3)",
  },
  tabRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    justifyContent: "center",
  },
  tab: {
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 248, 231, 0.15)",
    background: "transparent",
    color: "var(--brown-light)",
    fontSize: "0.85rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  tabActive: {
    background: "rgba(212, 175, 55, 0.2)",
    color: "var(--gold)",
    borderColor: "rgba(212, 175, 55, 0.4)",
    fontWeight: "600",
  },
  sectionLabel: {
    color: "var(--gold)",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.5rem",
    marginTop: "0.25rem",
  },
  colorRow: {
    display: "flex",
    gap: "0.65rem",
    marginBottom: "1rem",
    justifyContent: "center",
  },
  colorBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "3px solid rgba(255, 248, 231, 0.2)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  colorSelected: {
    border: "3px solid var(--gold)",
    boxShadow: "0 0 12px rgba(212, 175, 55, 0.4)",
  },
  checkMark: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
  },
  optionsGrid: {
    display: "flex",
    gap: "0.65rem",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
  optionBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.75rem 0.85rem",
    background: "rgba(255, 248, 231, 0.06)",
    border: "2px solid rgba(255, 248, 231, 0.2)",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "80px",
  },
  optionSelected: {
    borderColor: "var(--gold)",
    background: "rgba(212, 175, 55, 0.15)",
    boxShadow: "0 0 12px rgba(212, 175, 55, 0.2)",
  },
  basePreview: {
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid rgba(255, 255, 255, 0.1)",
  },
  optionEmoji: {
    fontSize: "1.6rem",
    lineHeight: 1,
  },
  optionSwatch: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "2px solid rgba(255, 255, 255, 0.15)",
  },
  optionLabel: {
    fontSize: "0.7rem",
    color: "var(--cream)",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 1.2,
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    paddingTop: "0.5rem",
  },
  cancelBtn: {
    flex: 1,
    padding: "0.85rem",
    background: "rgba(255, 248, 231, 0.08)",
    color: "var(--cream)",
    border: "1px solid rgba(255, 248, 231, 0.2)",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  saveBtn: {
    flex: 2,
    padding: "0.85rem",
    background: "linear-gradient(135deg, var(--gold), var(--gold-bright))",
    color: "var(--brown-dark)",
    border: "none",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(212, 175, 55, 0.3)",
    transition: "transform 0.2s ease",
  },
};

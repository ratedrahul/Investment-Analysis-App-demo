import React from "react";

const MEDAL = ["#f59e0b", "#9ca3af", "#cd7f32"];

function TopFundsTable({ funds, onSelectFund }) {
  if (!funds || funds.length === 0) return null;

  return (
    <section>
      <h2 style={headingStyle}>Top 3 Most Consistent Funds</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {funds.map((fund, i) => (
          <div
            key={fund.fund_name}
            onClick={() => onSelectFund?.(fund.fund_name)}
            style={{
              ...rowStyle,
              borderLeft: `4px solid ${MEDAL[i]}`,
              cursor: onSelectFund ? "pointer" : "default",
            }}
            onMouseEnter={(e) => {
              if (onSelectFund) e.currentTarget.style.transform = "translateY(-1px)";
              if (onSelectFund) e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "var(--shadow)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ ...rankBadge, background: MEDAL[i] }}>#{i + 1}</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "1rem" }}>
                {fund.fund_name}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span>Avg <strong style={{ color: "var(--text-primary)" }}>{fund.average_return.toFixed(2)}%</strong></span>
              <span>Vol <strong style={{ color: "var(--text-primary)" }}>{fund.volatility.toFixed(2)}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const headingStyle = {
  fontSize: "1.1rem",
  marginBottom: "0.75rem",
  color: "var(--text-primary)",
  fontWeight: 600,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.85rem 1rem",
  background: "var(--bg-card)",
  borderRadius: "8px",
  boxShadow: "var(--shadow)",
  transition: "all 0.15s",
};

const rankBadge = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.75rem",
  borderRadius: "6px",
  padding: "0.2rem 0.5rem",
  minWidth: "28px",
  textAlign: "center",
};

export default TopFundsTable;

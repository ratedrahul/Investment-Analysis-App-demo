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
              if (onSelectFund) e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ ...rankBadge, background: MEDAL[i] }}>#{i + 1}</span>
              <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "1rem" }}>
                {fund.fund_name}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "#475569" }}>
              <span>Avg <strong style={{ color: "#1e293b" }}>{fund.average_return.toFixed(2)}%</strong></span>
              <span>Vol <strong style={{ color: "#1e293b" }}>{fund.volatility.toFixed(2)}</strong></span>
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
  color: "#1e293b",
  fontWeight: 600,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.85rem 1rem",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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

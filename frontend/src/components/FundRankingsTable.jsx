import React, { useState, useMemo } from "react";

function FundRankingsTable({ funds, onSelectFund }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return funds;
    const q = search.toLowerCase();
    return funds.filter((f) => f.fund_name.toLowerCase().includes(q));
  }, [funds, search]);

  if (!funds || funds.length === 0) return null;

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 style={headingStyle}>Fund Rankings</h2>
        <input
          type="text"
          placeholder="Search funds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />
      </div>

      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th style={headerStyle}>Rank</th>
              <th style={headerStyle}>Fund Name</th>
              <th style={headerStyle}>Avg Return (%)</th>
              <th style={headerStyle}>Volatility</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((fund, index) => (
              <tr
                key={fund.fund_name}
                onClick={() => onSelectFund(fund.fund_name)}
                style={{
                  background: index % 2 === 0 ? "#fff" : "#f8fafc",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#eef2ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#f8fafc"; }}
              >
                <td style={{ ...cellStyle, fontWeight: 600, color: "#6366f1", width: "60px" }}>
                  #{fund.rank}
                </td>
                <td style={{ ...cellStyle, fontWeight: 500 }}>{fund.fund_name}</td>
                <td style={cellStyle}>{fund.average_return.toFixed(2)}%</td>
                <td style={cellStyle}>
                  <span style={{ ...volBadge, background: getVolColor(fund.volatility) }}>
                    {fund.volatility.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ ...cellStyle, textAlign: "center", color: "#94a3b8" }}>
                  No funds match "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.5rem" }}>
        Showing {filtered.length} of {funds.length} funds. Click a row to view details.
      </p>
    </section>
  );
}

function getVolColor(vol) {
  if (vol < 0.5) return "#dcfce7";
  if (vol < 1.5) return "#fef9c3";
  return "#fee2e2";
}

const headingStyle = {
  fontSize: "1.1rem",
  color: "#1e293b",
  fontWeight: 600,
  margin: 0,
};

const searchStyle = {
  padding: "0.45rem 0.75rem",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  fontSize: "0.85rem",
  outline: "none",
  width: "200px",
  background: "#fff",
};

const tableContainer = {
  background: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  maxHeight: "460px",
  overflowY: "auto",
};

const headerStyle = {
  padding: "0.65rem 1rem",
  textAlign: "left",
  borderBottom: "2px solid #e2e8f0",
  color: "#475569",
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: 600,
};

const cellStyle = {
  padding: "0.6rem 1rem",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "0.9rem",
};

const volBadge = {
  display: "inline-block",
  padding: "0.15rem 0.5rem",
  borderRadius: "10px",
  fontSize: "0.8rem",
  fontWeight: 600,
};

export default FundRankingsTable;

import React from "react";

const headerStyle = {
  padding: "0.75rem 1.25rem",
  textAlign: "left",
  borderBottom: "2px solid #e2e8f0",
  color: "#475569",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const cellStyle = {
  padding: "0.75rem 1.25rem",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "0.95rem",
};

function TopFundsTable({ funds }) {
  if (!funds || funds.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#1e293b" }}>
        Top 3 Most Consistent Funds
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <thead style={{ background: "#f8fafc" }}>
          <tr>
            <th style={headerStyle}>Rank</th>
            <th style={headerStyle}>Fund Name</th>
            <th style={headerStyle}>Average Return (%)</th>
            <th style={headerStyle}>Volatility Score</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, index) => (
            <tr
              key={fund.fund_name}
              style={{ background: index % 2 === 0 ? "#fff" : "#f8fafc" }}
            >
              <td style={{ ...cellStyle, fontWeight: 600, color: "#6366f1" }}>
                #{index + 1}
              </td>
              <td style={{ ...cellStyle, fontWeight: 500 }}>{fund.fund_name}</td>
              <td style={cellStyle}>{fund.average_return.toFixed(2)}%</td>
              <td style={cellStyle}>{fund.volatility.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default TopFundsTable;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { fetchFundDetail } from "../services/api";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const cardStyle = {
  background: "#fff",
  borderRadius: "8px",
  padding: "1.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  marginBottom: "1rem",
};

function FundDetailView({ fundName, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFundDetail(fundName)
      .then((data) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, [fundName]);

  if (loading) {
    return (
      <section style={{ ...cardStyle, textAlign: "center", color: "#64748b" }}>
        Loading {fundName}...
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          ...cardStyle,
          background: "#fef2f2",
          color: "#dc2626",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Error: {error}</span>
        <button onClick={onClose} style={closeBtnStyle}>
          Close
        </button>
      </section>
    );
  }

  const chartData = detail.monthly_returns.map((value, i) => ({
    month: MONTH_LABELS[i],
    return: value,
  }));

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0 }}>
          {detail.fund_name} — Detail
        </h2>
        <button onClick={onClose} style={closeBtnStyle}>
          Back to Rankings
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div style={{ ...cardStyle, flex: 1, minWidth: "200px", marginBottom: 0 }}>
          <div style={statLabelStyle}>Average Return</div>
          <div style={statValueStyle}>{detail.average_return.toFixed(2)}%</div>
        </div>
        <div style={{ ...cardStyle, flex: 1, minWidth: "200px", marginBottom: 0 }}>
          <div style={statLabelStyle}>Volatility (Std Dev)</div>
          <div style={statValueStyle}>{detail.volatility.toFixed(2)}</div>
        </div>
      </div>

      {/* Monthly returns line chart */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "1rem", color: "#334155", marginTop: 0, marginBottom: "1rem" }}>
          Monthly Returns (%)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              label={{
                value: "Return (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#64748b" },
              }}
            />
            <Tooltip
              formatter={(value) => [`${value.toFixed(1)}%`, "Return"]}
              contentStyle={{ borderRadius: "6px", fontSize: "0.9rem" }}
            />
            <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
            <ReferenceLine
              y={detail.average_return}
              stroke="#f59e0b"
              strokeDasharray="5 3"
              strokeWidth={1.5}
              label={{
                value: `Avg ${detail.average_return.toFixed(2)}%`,
                position: "right",
                style: { fontSize: 11, fill: "#f59e0b" },
              }}
            />
            <Line
              type="monotone"
              dataKey="return"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4, fill: "#6366f1" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly returns table */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "1rem", color: "#334155", marginTop: 0, marginBottom: "1rem" }}>
          Monthly Breakdown
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {MONTH_LABELS.map((m) => (
                <th key={m} style={monthHeaderStyle}>
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {detail.monthly_returns.map((val, i) => (
                <td
                  key={i}
                  style={{
                    ...monthCellStyle,
                    color: val >= 0 ? "#16a34a" : "#dc2626",
                  }}
                >
                  {val.toFixed(1)}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

const closeBtnStyle = {
  padding: "0.5rem 1rem",
  background: "#e2e8f0",
  border: "none",
  borderRadius: "6px",
  fontSize: "0.85rem",
  cursor: "pointer",
  color: "#334155",
  fontWeight: 500,
};

const statLabelStyle = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#64748b",
  marginBottom: "0.25rem",
};

const statValueStyle = {
  fontSize: "1.75rem",
  fontWeight: 700,
  color: "#1e293b",
};

const monthHeaderStyle = {
  padding: "0.5rem 0.4rem",
  textAlign: "center",
  borderBottom: "2px solid #e2e8f0",
  color: "#475569",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const monthCellStyle = {
  padding: "0.6rem 0.4rem",
  textAlign: "center",
  fontSize: "0.9rem",
  fontWeight: 500,
};

export default FundDetailView;

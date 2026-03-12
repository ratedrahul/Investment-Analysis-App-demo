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
  Area,
  AreaChart,
} from "recharts";
import { fetchFundDetail } from "../services/api";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function FundDetailView({ fundName }) {
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
      <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
        <div style={spinnerStyle} />
        <div style={{ marginTop: "0.75rem" }}>Loading {fundName}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#dc2626" }}>
        Error: {error}
      </div>
    );
  }

  const chartData = detail.monthly_returns.map((value, i) => ({
    month: MONTH_LABELS[i],
    return: value,
  }));

  const min = Math.min(...detail.monthly_returns);
  const max = Math.max(...detail.monthly_returns);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.35rem", color: "#1e293b", margin: 0 }}>
          {detail.fund_name}
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          12-month performance detail
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard label="Avg Return" value={`${detail.average_return.toFixed(2)}%`} color="#6366f1" />
        <StatCard label="Volatility" value={detail.volatility.toFixed(2)} color="#f59e0b" />
        <StatCard label="Best Month" value={`${max.toFixed(1)}%`} color="#16a34a" />
        <StatCard label="Worst Month" value={`${min.toFixed(1)}%`} color="#dc2626" />
      </div>

      {/* Area chart */}
      <div style={cardStyle}>
        <h3 style={sectionHeading}>Monthly Returns (%)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value) => [`${value.toFixed(1)}%`, "Return"]}
              contentStyle={{ borderRadius: "8px", fontSize: "0.85rem", border: "1px solid #e2e8f0" }}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
            <ReferenceLine
              y={detail.average_return}
              stroke="#f59e0b"
              strokeDasharray="5 3"
              strokeWidth={1.5}
              label={{
                value: `Avg ${detail.average_return.toFixed(2)}%`,
                position: "right",
                style: { fontSize: 10, fill: "#f59e0b" },
              }}
            />
            <Area
              type="monotone"
              dataKey="return"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#returnGradient)"
              dot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly breakdown */}
      <div style={cardStyle}>
        <h3 style={sectionHeading}>Monthly Breakdown</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {MONTH_LABELS.map((m) => (
                  <th key={m} style={monthHeaderStyle}>{m}</th>
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
                      background: val >= 0 ? "#f0fdf4" : "#fef2f2",
                    }}
                  >
                    {val >= 0 ? "+" : ""}{val.toFixed(1)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "8px",
        padding: "1rem",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "0.2rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1e293b" }}>
        {value}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f8fafc",
  borderRadius: "8px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

const sectionHeading = {
  fontSize: "0.9rem",
  color: "#334155",
  marginTop: 0,
  marginBottom: "0.75rem",
  fontWeight: 600,
};

const spinnerStyle = {
  width: "28px",
  height: "28px",
  border: "3px solid #e2e8f0",
  borderTopColor: "#6366f1",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
  margin: "0 auto",
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
  fontSize: "0.85rem",
  fontWeight: 600,
  borderRadius: "4px",
};

export default FundDetailView;

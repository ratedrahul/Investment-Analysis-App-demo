import React, { useEffect, useState } from "react";
import {
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
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
        <div style={spinnerStyle} />
        <div style={{ marginTop: "0.75rem" }}>Loading {fundName}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--error)" }}>
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
        <h2 style={{ fontSize: "1.35rem", color: "var(--text-primary)", margin: 0 }}>
          {detail.fund_name}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
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
        <StatCard label="Avg Return" value={`${detail.average_return.toFixed(2)}%`} color="var(--accent)" />
        <StatCard label="Volatility" value={detail.volatility.toFixed(2)} color="var(--amber)" />
        <StatCard label="Best Month" value={`${max.toFixed(1)}%`} color="var(--success)" />
        <StatCard label="Worst Month" value={`${min.toFixed(1)}%`} color="var(--error)" />
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
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              tickFormatter={(v) => `${v}%`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value) => [`${value.toFixed(1)}%`, "Return"]}
              contentStyle={{
                borderRadius: "8px",
                fontSize: "0.85rem",
                border: "1px solid var(--chart-tooltip-border)",
                background: "var(--chart-tooltip-bg)",
                color: "var(--text-primary)",
              }}
            />
            <ReferenceLine y={0} stroke="var(--chart-zero)" strokeWidth={1} />
            <ReferenceLine
              y={detail.average_return}
              stroke="var(--amber)"
              strokeDasharray="5 3"
              strokeWidth={1.5}
              label={{
                value: `Avg ${detail.average_return.toFixed(2)}%`,
                position: "right",
                style: { fontSize: 10, fill: "var(--amber)" },
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
            <thead style={{ background: "var(--bg-card-alt)" }}>
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
                      color: val >= 0 ? "var(--success)" : "var(--error)",
                      background: val >= 0 ? "var(--positive-bg)" : "var(--negative-bg)",
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
        background: "var(--bg-card-alt)",
        borderRadius: "8px",
        padding: "1rem",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "var(--bg-card-alt)",
  borderRadius: "8px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

const sectionHeading = {
  fontSize: "0.9rem",
  color: "var(--text-secondary)",
  marginTop: 0,
  marginBottom: "0.75rem",
  fontWeight: 600,
};

const spinnerStyle = {
  width: "28px",
  height: "28px",
  border: "3px solid var(--border)",
  borderTopColor: "var(--accent)",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
  margin: "0 auto",
};

const monthHeaderStyle = {
  padding: "0.5rem 0.4rem",
  textAlign: "center",
  borderBottom: "2px solid var(--border)",
  color: "var(--text-secondary)",
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

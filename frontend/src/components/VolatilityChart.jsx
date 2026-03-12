import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BAR_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa"];

function VolatilityChart({ funds }) {
  if (!funds || funds.length === 0) return null;

  const data = funds.map((f) => ({
    name: f.fund_name,
    volatility: f.volatility,
    averageReturn: f.average_return,
  }));

  return (
    <section>
      <h2 style={headingStyle}>Volatility Comparison</h2>
      <div style={chartCard}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              label={{
                value: "Std Dev",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                style: { fontSize: 11, fill: "var(--text-dimmed)" },
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                value.toFixed(2),
                name === "volatility" ? "Volatility" : name,
              ]}
              contentStyle={{
                borderRadius: "8px",
                fontSize: "0.85rem",
                border: "1px solid var(--chart-tooltip-border)",
                background: "var(--chart-tooltip-bg)",
                color: "var(--text-primary)",
              }}
            />
            <Bar dataKey="volatility" radius={[6, 6, 0, 0]} barSize={48}>
              {data.map((_entry, index) => (
                <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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

const chartCard = {
  background: "var(--bg-card)",
  borderRadius: "8px",
  padding: "1.25rem",
  boxShadow: "var(--shadow)",
};

export default VolatilityChart;

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
  if (!funds || funds.length === 0) {
    return null;
  }

  const data = funds.map((f) => ({
    name: f.fund_name,
    volatility: f.volatility,
    averageReturn: f.average_return,
  }));

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#1e293b" }}>
        Volatility Comparison
      </h2>

      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis
              tick={{ fontSize: 13 }}
              label={{
                value: "Volatility (Std Dev)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#64748b" },
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                const label = name === "volatility" ? "Volatility" : name;
                return [value.toFixed(2), label];
              }}
              contentStyle={{ borderRadius: "6px", fontSize: "0.9rem" }}
            />
            <Bar dataKey="volatility" radius={[4, 4, 0, 0]} barSize={60}>
              {data.map((_entry, index) => (
                <Cell
                  key={index}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default VolatilityChart;

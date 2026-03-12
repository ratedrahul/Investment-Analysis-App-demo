import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MAX_MONTHS = 1200;

function simulate(goalAmount, monthlyContribution, annualRate) {
  if (goalAmount <= 0 || monthlyContribution <= 0) return [];

  const monthlyRate = annualRate / 12 / 100;
  const projections = [];
  let balance = 0;

  for (let month = 1; month <= MAX_MONTHS; month++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate);
    projections.push({ month, balance: Math.round(balance * 100) / 100 });
    if (balance >= goalAmount) break;
  }

  return projections;
}

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  flex: 1,
  minWidth: "180px",
};

const labelStyle = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#475569",
  fontWeight: 600,
};

const inputStyle = {
  padding: "0.6rem 0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "8px",
  padding: "1.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  marginBottom: "1rem",
};

const headerCellStyle = {
  padding: "0.5rem 1rem",
  textAlign: "left",
  borderBottom: "2px solid #e2e8f0",
  color: "#475569",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const cellStyle = {
  padding: "0.5rem 1rem",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "0.9rem",
};

function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function GoalMonthsCalculator() {
  const [goalAmount, setGoalAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(6);

  const projections = useMemo(
    () => simulate(goalAmount, monthlyContribution, annualRate),
    [goalAmount, monthlyContribution, annualRate]
  );

  const monthsRequired = projections.length;
  const goalReached = monthsRequired > 0 && projections[monthsRequired - 1].balance >= goalAmount;

  const chartTicks = useMemo(() => {
    if (monthsRequired <= 12) return undefined;
    const step = Math.ceil(monthsRequired / 8);
    const ticks = [];
    for (let i = step; i <= monthsRequired; i += step) ticks.push(i);
    if (ticks[ticks.length - 1] !== monthsRequired) ticks.push(monthsRequired);
    return ticks;
  }, [monthsRequired]);

  const tableRows = useMemo(() => {
    if (projections.length <= 20) return projections;
    const step = Math.max(1, Math.floor(projections.length / 18));
    const rows = [];
    for (let i = 0; i < projections.length - 1; i += step) {
      rows.push(projections[i]);
    }
    rows.push(projections[projections.length - 1]);
    return rows;
  }, [projections]);

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#1e293b" }}>
        Financial Goal Calculator
      </h2>

      {/* --- Inputs --- */}
      <div style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Goal Amount ($)</label>
            <input
              type="number"
              min="1"
              style={inputStyle}
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value))}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Monthly Contribution ($)</label>
            <input
              type="number"
              min="1"
              style={inputStyle}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Annual Interest Rate (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              style={inputStyle}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* --- Summary --- */}
      {goalReached && (
        <div
          style={{
            ...cardStyle,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>&#10003;</span>
          <span style={{ fontSize: "1rem", color: "#166534" }}>
            You will reach{" "}
            <strong>{formatCurrency(goalAmount)}</strong> in{" "}
            <strong>
              {monthsRequired} month{monthsRequired !== 1 && "s"}
            </strong>{" "}
            ({(monthsRequired / 12).toFixed(1)} years) with a final balance of{" "}
            <strong>{formatCurrency(projections[monthsRequired - 1].balance)}</strong>.
          </span>
        </div>
      )}

      {monthsRequired > 0 && !goalReached && (
        <div
          style={{
            ...cardStyle,
            background: "#fefce8",
            border: "1px solid #fde68a",
          }}
        >
          <span style={{ color: "#854d0e", fontSize: "0.95rem" }}>
            The goal was not reached within {MAX_MONTHS} months. Try increasing
            your monthly contribution or interest rate.
          </span>
        </div>
      )}

      {projections.length === 0 && (
        <div style={{ ...cardStyle, color: "#64748b", fontSize: "0.95rem" }}>
          Enter a valid goal amount and monthly contribution to see projections.
        </div>
      )}

      {/* --- Chart --- */}
      {projections.length > 0 && (
        <div style={cardStyle}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={projections}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                ticks={chartTicks}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Month",
                  position: "insideBottomRight",
                  offset: -5,
                  style: { fontSize: 12, fill: "#64748b" },
                }}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Balance"]}
                labelFormatter={(label) => `Month ${label}`}
                contentStyle={{ borderRadius: "6px", fontSize: "0.9rem" }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* --- Table --- */}
      {projections.length > 0 && (
        <div style={cardStyle}>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
                <tr>
                  <th style={headerCellStyle}>Month</th>
                  <th style={headerCellStyle}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.month}
                    style={{
                      background: row.balance >= goalAmount ? "#f0fdf4" : "#fff",
                    }}
                  >
                    <td style={cellStyle}>{row.month}</td>
                    <td style={cellStyle}>{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default GoalMonthsCalculator;

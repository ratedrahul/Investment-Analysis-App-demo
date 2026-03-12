import React, { useCallback, useEffect, useState } from "react";
import TopFundsTable from "../components/TopFundsTable";
import VolatilityChart from "../components/VolatilityChart";
import FundRankingsTable from "../components/FundRankingsTable";
import FundDetailView from "../components/FundDetailView";
import Modal from "../components/Modal";
import GoalMonthsCalculator from "../components/GoalMonthsCalculator";
import {
  fetchTopConsistentFunds,
  fetchFundRankings,
  generateDataset,
} from "../services/api";

function Dashboard() {
  const [topFunds, setTopFunds] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchTopConsistentFunds(), fetchFundRankings()])
      .then(([topData, rankData]) => {
        setTopFunds(topData);
        setRankings(rankData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load fund data");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerate = () => {
    setGenerating(true);
    setGenMessage(null);
    generateDataset()
      .then((data) => {
        setGenMessage({
          type: "success",
          text: `Dataset generated successfully — ${data.fund_count} funds created.`,
        });
        setSelectedFund(null);
        loadData();
      })
      .catch((err) => {
        setGenMessage({
          type: "error",
          text: err.message || "Failed to generate dataset",
        });
      })
      .finally(() => setGenerating(false));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
        <div style={spinnerStyleLarge} />
        <div style={{ marginTop: "1rem", fontSize: "1rem" }}>Loading fund data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorBannerStyle}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      {/* Action bar */}
      <div style={actionBarStyle}>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {rankings.length} funds loaded
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a href="/api/funds/export/" download style={btnSecondary}>
            Export CSV
          </a>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={generating ? btnDisabled : btnPrimary}
          >
            {generating ? "Generating..." : "Generate Dataset"}
          </button>
        </div>
      </div>

      {/* Status banner */}
      {genMessage && (
        <div
          style={{
            ...bannerStyle,
            background: genMessage.type === "success" ? "var(--success-bg)" : "var(--error-bg)",
            borderColor: genMessage.type === "success" ? "var(--success-border)" : "var(--error-border)",
            color: genMessage.type === "success" ? "var(--success-dark)" : "var(--error)",
          }}
        >
          {genMessage.text}
        </div>
      )}

      {/* Top 3 + Volatility side-by-side on wide screens */}
      <div style={topSectionGrid}>
        <TopFundsTable funds={topFunds} onSelectFund={setSelectedFund} />
        <VolatilityChart funds={topFunds} />
      </div>

      {/* Rankings */}
      <FundRankingsTable funds={rankings} onSelectFund={setSelectedFund} />

      {/* Fund detail modal */}
      <Modal open={!!selectedFund} onClose={() => setSelectedFund(null)}>
        {selectedFund && <FundDetailView fundName={selectedFund} />}
      </Modal>

      {/* Goal calculator */}
      <GoalMonthsCalculator />
    </div>
  );
}

const spinnerStyleLarge = {
  width: "36px",
  height: "36px",
  border: "3px solid var(--border)",
  borderTopColor: "var(--accent)",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
  margin: "0 auto",
};

const errorBannerStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "var(--error)",
  background: "var(--error-bg)",
  borderRadius: "8px",
  margin: "2rem auto",
  maxWidth: "600px",
  border: "1px solid var(--error-border)",
};

const actionBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const btnBase = {
  padding: "0.55rem 1.1rem",
  border: "none",
  borderRadius: "6px",
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.15s",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const btnPrimary = { ...btnBase, background: "var(--accent)", color: "#fff" };
const btnSecondary = { ...btnBase, background: "var(--btn-secondary-bg)", color: "var(--btn-secondary-color)" };
const btnDisabled = { ...btnBase, background: "var(--accent-muted)", color: "#fff", cursor: "not-allowed" };

const bannerStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  fontSize: "0.9rem",
  marginBottom: "1.5rem",
  border: "1px solid",
};

const topSectionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  gap: "1.5rem",
  marginBottom: "0.5rem",
};

export default Dashboard;

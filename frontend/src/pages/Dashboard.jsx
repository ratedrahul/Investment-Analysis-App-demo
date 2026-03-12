import React, { useCallback, useEffect, useState } from "react";
import TopFundsTable from "../components/TopFundsTable";
import VolatilityChart from "../components/VolatilityChart";
import FundRankingsTable from "../components/FundRankingsTable";
import FundDetailView from "../components/FundDetailView";
import GoalMonthsCalculator from "../components/GoalMonthsCalculator";
import {
  fetchTopConsistentFunds,
  fetchFundRankings,
  generateDataset,
} from "../services/api";

const btnStyle = {
  padding: "0.6rem 1.25rem",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.15s",
};

const btnDisabledStyle = {
  ...btnStyle,
  background: "#a5b4fc",
  cursor: "not-allowed",
};

const messageBannerStyle = {
  padding: "0.75rem 1.25rem",
  borderRadius: "6px",
  fontSize: "0.9rem",
  marginBottom: "1.5rem",
};

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
      <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
        Loading fund data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "#dc2626",
          background: "#fef2f2",
          borderRadius: "8px",
          margin: "2rem auto",
          maxWidth: "600px",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      {/* Generate Dataset */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={generating ? btnDisabledStyle : btnStyle}
        >
          {generating ? "Generating..." : "Generate Dataset"}
        </button>
      </div>

      {genMessage && (
        <div
          style={{
            ...messageBannerStyle,
            background: genMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
            border:
              genMessage.type === "success"
                ? "1px solid #bbf7d0"
                : "1px solid #fecaca",
            color: genMessage.type === "success" ? "#166534" : "#dc2626",
          }}
        >
          {genMessage.text}
        </div>
      )}

      {/* Top 3 + Volatility Chart */}
      <TopFundsTable funds={topFunds} />
      <VolatilityChart funds={topFunds} />

      {/* Fund Detail or Rankings Table */}
      {selectedFund ? (
        <FundDetailView
          fundName={selectedFund}
          onClose={() => setSelectedFund(null)}
        />
      ) : (
        <FundRankingsTable funds={rankings} onSelectFund={setSelectedFund} />
      )}

      {/* Goal Calculator */}
      <GoalMonthsCalculator />
    </div>
  );
}

export default Dashboard;

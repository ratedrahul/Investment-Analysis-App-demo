import React from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <header style={headerStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={logoStyle}>IF</div>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                Investment Fund Analysis
              </h1>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.7 }}>
                Consistency ranking dashboard
              </p>
            </div>
          </div>
          <a
            href="/api/docs/"
            target="_blank"
            rel="noopener noreferrer"
            style={apiLinkStyle}
          >
            API Docs
          </a>
        </div>
      </header>
      <main style={{ padding: "1.5rem 1rem" }}>
        <Dashboard />
      </main>
    </div>
  );
}

const headerStyle = {
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  color: "#fff",
  padding: "0.9rem 1.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
};

const logoStyle = {
  background: "#6366f1",
  color: "#fff",
  fontWeight: 800,
  fontSize: "0.85rem",
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const apiLinkStyle = {
  color: "#94a3b8",
  fontSize: "0.8rem",
  textDecoration: "none",
  padding: "0.35rem 0.75rem",
  border: "1px solid #475569",
  borderRadius: "6px",
  transition: "all 0.15s",
};

export default App;

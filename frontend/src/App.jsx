import React from "react";
import Dashboard from "./pages/Dashboard";
import { useTheme } from "./ThemeContext";

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "var(--text-primary)",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <header style={headerStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={logoStyle}>IF</div>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "var(--text-on-header)" }}>
                Investment Fund Analysis
              </h1>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-header-sub)" }}>
                Consistency ranking dashboard
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button onClick={toggle} style={themeToggleStyle} aria-label="Toggle theme">
              {theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
            </button>
            <a
              href="/api/docs/"
              target="_blank"
              rel="noopener noreferrer"
              style={apiLinkStyle}
            >
              API Docs
            </a>
          </div>
        </div>
      </header>
      <main style={{ padding: "1.5rem 1rem" }}>
        <Dashboard />
      </main>
    </div>
  );
}

const headerStyle = {
  background: "var(--bg-header)",
  color: "var(--text-on-header)",
  padding: "0.9rem 1.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
  transition: "background 0.3s",
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

const themeToggleStyle = {
  background: "transparent",
  border: "1px solid var(--header-link-border)",
  borderRadius: "6px",
  cursor: "pointer",
  padding: "0.35rem 0.5rem",
  fontSize: "1.1rem",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s",
};

const apiLinkStyle = {
  color: "var(--header-link-color)",
  fontSize: "0.8rem",
  textDecoration: "none",
  padding: "0.35rem 0.75rem",
  border: "1px solid var(--header-link-border)",
  borderRadius: "6px",
  transition: "all 0.15s",
};

export default App;

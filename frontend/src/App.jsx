import React from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
      <header
        style={{
          background: "#1e293b",
          color: "#fff",
          padding: "1.25rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
          Investment Fund Analysis
        </h1>
      </header>
      <main style={{ padding: "2rem 1rem" }}>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;

import React from "react";

const NotFound: React.FC = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f8f8",
    color: "#222"
  }}>
    <h1 style={{ fontSize: "5rem", marginBottom: "0.5rem" }}>404</h1>
    <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
      Sorry, the page you are looking for was not found.
    </p>
    <button
      style={{
        padding: "0.75rem 2rem",
        fontSize: "1rem",
        background: "#0078d7",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        transition: "background 0.2s"
      }}
      onClick={() => window.location.href = "/"}
    >
      Go Home
    </button>
  </div>
);

export default NotFound;

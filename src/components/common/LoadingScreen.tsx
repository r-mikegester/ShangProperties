import React from "react";

const LoadingScreen: React.FC = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#222",
    color: "#fff"
  }}>
    <div style={{
      width: 80,
      height: 80,
      marginBottom: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: 80,
        height: 80,
        border: "8px solid #0078d7",
        borderTop: "8px solid #fff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
    </div>
    <div style={{ fontSize: "1.5rem", letterSpacing: 2 }}>Loading...</div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingScreen;

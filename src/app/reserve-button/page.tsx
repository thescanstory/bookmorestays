"use client";

import { Scene } from "@/components/GetStartedScene";

export default function ReserveButtonPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#111114", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "600", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Traitors of Coorg · Book More Stays
        </h1>
        <p style={{ color: "#8a8a8f", fontSize: "15px", margin: 0 }}>
          Tactile liquid-chrome Reserve Your Game control with refractive spectral ring
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: "560px", height: "300px", background: "#222225", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", display: "grid", placeItems: "center", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <Scene />
      </div>
    </main>
  );
}

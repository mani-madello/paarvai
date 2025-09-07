import React, { useMemo, useState } from "react";
import { FaUserCheck, FaUserTimes, FaBell } from "react-icons/fa";
import "./Dashboard.css"; // grid + base styles

type Detection = {
  id: string;
  type: "Stranger" | "Valid";
  name?: string;
  location: string;
  time: string;
  thumb: string;
};

export default function Dashboard() {
  const LOCATIONS = ["All", "Chennai", "Madurai"];
  const [activeLocation, setActiveLocation] = useState("All");

  // Demo detections
  const initialDetections: Detection[] = [
    { id: "1", type: "Valid", name: "Madhavan Elango", location: "Chennai - loc 1", time: "10:32 AM", thumb: "https://picsum.photos/seed/ravi/92/92" },
    { id: "2", type: "Stranger", location: "Madurai - loc 3", time: "11:05 AM", thumb: "https://picsum.photos/seed/stranger/92/92" },
    { id: "3", type: "Stranger", location: "Madurai - loc 1", time: "11:45 AM", thumb: "https://picsum.photos/seed/theft/92/92" },
    { id: "4", type: "Valid", name: "Anita Sharma", location: "Chennai - loc 2", time: "12:10 PM", thumb: "https://picsum.photos/seed/anita/92/92" },
  ];
  const [selected, setSelected] = useState<Detection | null>(initialDetections[0]);

  const filtered = useMemo(
    () =>
      initialDetections.filter(
        (d) => activeLocation === "All" || d.location.includes(activeLocation)
      ),
    [activeLocation]
  );

  const quadrantStyle: React.CSSProperties = {
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  };

  const kpiCardStyle: React.CSSProperties = {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    fontWeight: 600,
    textAlign: "center",
    color: "#fff",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f0f2f5" }}>

      {/* Grid */}
      <div
        className="dashboard-grid"
        style={{
          flex: 1,
          padding: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 12,
        }}
      >
        {/* Q1: Live Detections */}
        <div style={quadrantStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
            Live Detections
            <select
              value={activeLocation}
              onChange={(e) => setActiveLocation(e.target.value)}
              style={{ borderRadius: 6, padding: 4 }}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
            <div style={{ ...kpiCardStyle, background: "linear-gradient(135deg,#10b981,#34d399)" }}>
               Valid {filtered.filter((d) => d.type === "Valid").length}
            </div>
            <div style={{ ...kpiCardStyle, background: "linear-gradient(135deg,#ef4444,#f87171)" }}>
               Strangers {filtered.filter((d) => d.type === "Stranger").length}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelected(d)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 12,
                  marginBottom: 6,
                  background: d.id === selected?.id ? "rgba(255,106,0,0.15)" : "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                <img
                  src={d.thumb}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                />
                <div style={{ marginLeft: 8 }}>
                  <div style={{ fontWeight: 600 }}>{d.name ?? "Unknown"}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    {d.location} • {d.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Q2: Person Profile */}
        <div style={quadrantStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Person Profile</div>
          {selected ? (
            <div>
              <img
                src={selected.thumb}
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12 }}
              />
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                  {selected.name ?? "Unknown"}
                </div>
                <div style={{ fontSize: 14, color: "#555" }}>{selected.location}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  Detected at {selected.time}
                </div>
              </div>
            </div>
          ) : (
            <div>Select a detection from left panel</div>
          )}
        </div>

        {/* Q3: CCTV Playback */}
        <div style={quadrantStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Entrance CCTV</div>
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
            autoPlay
            muted
            loop
            controls
          />
        </div>

        {/* Q4: Incidents */}
        <div
          style={{
            ...quadrantStyle,
            position: "relative",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          {/* Background Image */}
          <div
            style={{
              backgroundImage: "url('/assets/jewel.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.6,        // slightly transparent
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1, padding: "1rem", display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaBell /> Incidents
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: 1, text: "Chennai - loc 1 - Suspicious behaviour detected" },
                { id: 2, text: "Madurai - loc 3 - Suspicious behaviour detected" },
                { id: 3, text: "Madurai - loc 1 - Possible Theft" },
                { id: 4, text: "Chennai - loc 2 - Overcrowding" },
              ].map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    backdropFilter: "blur(6px)", // glass effect
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(255,255,255,0.15))";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <span style={{ fontSize: 14 }}>{inc.text}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { label: "Snooze", color: "#fbbf24" },
                      { label: "Escalate", color: "#ef4444" },
                      { label: "Close", color: "#10b981" },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          padding: "4px 10px",
                          borderRadius: 8,
                          color: btn.color,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = `${btn.color}33`)} // semi-transparent hover
                        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

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

          <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden" }}>
            <iframe
              src="https://www.youtube.com/embed/2gY_H8Qszzs?autoplay=1&mute=1&loop=1&playlist=2gY_H8Qszzs"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="CCTV Live Feed"
            />
          </div>
        </div>

        {/* Q4: Incidents */}
        <div
          style={{
            ...quadrantStyle,
            position: "relative",
            color: "#fff",
            overflow: "hidden",
            backgroundColor: "#1f2937", // dark base if image fails
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
              opacity: 0.5,        // subtle transparency
              filter: "blur(2px)", // soft blur for depth
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1, padding: "1rem", display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#fbbf24",
              }}
            >
              <FaBell /> Incidents
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { id: 1, text: "Chennai - loc 1 - Suspicious behaviour detected" },
                { id: 2, text: "Madurai - loc 3 - Suspicious behaviour detected" },
                { id: 3, text: "Madurai - loc 1 - Possible Theft" },
                { id: 4, text: "Chennai - loc 2 - Overcrowding" },
              ].map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    backdropFilter: "blur(8px)",
                    background: "rgba(31,41,55,0.6)", // dark glass effect
                    borderRadius: 16,
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #fbbf24aa, #ef4444aa)";
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(31,41,55,0.6)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#f3f4f6" }}>{inc.text}</span>

                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { label: "Snooze", color: "#fbbf24" },
                      { label: "Escalate", color: "#ef4444" },
                      { label: "Close", color: "#10b981" },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        style={{
                          background: btn.color,
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 10,
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: `0 4px 12px ${btn.color}66`,
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.boxShadow = `0 6px 16px ${btn.color}99`;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = `0 4px 12px ${btn.color}66`;
                        }}
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

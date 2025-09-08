import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Dummy KPI data
const kpiData: Record<string, any> = {
  Chennai: {
    Tambaram: { total: 40, day: 82, returning: 4, incidents: 0 },
    "Anna Nagar": { total: 55, day: 120, returning: 10, incidents: 2 },
  },
  Madurai: {
    Tambaram: { total: 22, day: 60, returning: 3, incidents: 1 },
    "Anna Nagar": { total: 30, day: 95, returning: 7, incidents: 0 },
  },
};

// Repeat customers
const repeatCustomers = [
  { name: "Madhavan Elango", time: "11:35 am", snapshot: "https://picsum.photos/120/80?random=1" },
  { name: "Sundar Swaminathan", time: "12:10 pm", snapshot: "https://picsum.photos/120/80?random=2" },
  { name: "Rohit Sharma", time: "12:50 pm", snapshot: "https://picsum.photos/120/80?random=3" },
  { name: "Anita Kumari", time: "1:15 pm", snapshot: "https://picsum.photos/120/80?random=4" },
  { name: "Vikram Patel", time: "1:45 pm", snapshot: "https://picsum.photos/120/80?random=5" },
  { name: "Priya Reddy", time: "2:10 pm", snapshot: "https://picsum.photos/120/80?random=6" },
];

// Replace Action Points with Incidents + severity tags
const incidents = [
  { text: "Chennai - loc 1 - Suspicious behaviour detected", severity: "suspicious" },
  { text: "Madurai - loc 3 - Suspicious behaviour detected", severity: "suspicious" },
  { text: "Madurai - loc 1 - Possible Theft", severity: "critical" },
  { text: "Chennai - loc 2 - Overcrowding", severity: "moderate" },
];

const severityColors: Record<string, string> = {
  suspicious: "#f97316", // orange
  moderate: "#fbbf24",   // yellow
  critical: "#ef4444",   // red
};

// CCTV feeds
const cctvFeeds = [
  "https://www.youtube.com/embed/2gY_H8Qszzs",
  "https://www.youtube.com/watch?v=qfDUleaigsI",
  "https://www.youtube.com/watch?v=pLwaW2ZiZ8w",
  "https://www.youtube.com/watch?v=drQxPqjxS4s&t=7s"
];

const Dashboard: React.FC = () => {
  const [location, setLocation] = useState("Chennai");
  const [shop, setShop] = useState("Tambaram");

  const metrics = kpiData[location][shop];

  const sparklineData = {
    labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const quadrantStyle: React.CSSProperties = {
    flex: 1,
    background: "#0b1220",
    color: "#fff",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: windowHeight / 2 - 32, // dynamically half of window height minus gaps/padding
  };
  
  const scrollableContent: React.CSSProperties = {
    overflowY: "auto",
    flex: 1,
    paddingRight: 4, // small padding for scrollbar
  };

  return (
    <div
      className="dashboard-container"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 16,
        padding: 16,
        height: "100vh",
        background: "#001f3f",
      }}
    >
      {/* Q1 - KPIs + Sparkline */}
      <div style={quadrantStyle}>
        <div style={{ marginBottom: 8 }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div>
              <label className="block text-sm text-gray-300">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ background: "#1e293b", color: "#fff", padding: "4px 8px", borderRadius: "8px" }}
              >
                {Object.keys(kpiData).map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300">Shop</label>
              <select
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                style={{ background: "#1e293b", color: "#fff", padding: "4px 8px", borderRadius: "8px" }}
              >
                {Object.keys(kpiData[location]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable KPI + Sparkline */}
        <div style={scrollableContent}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            {[
              { label: "Total Customers", value: metrics.total },
              { label: "Day Customers", value: metrics.day },
              { label: "Returning Customers", value: metrics.returning },
              { label: "Incidents", value: metrics.incidents },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "8px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                }}
              >
                <h3 style={{ fontSize: "0.9rem", color: "#aaa" }}>{item.label}</h3>
                <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div style={{ height: "100px" }}>
            <h3 style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "4px" }}>Customer Trend</h3>
            <Line
              data={sparklineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { display: false }, y: { display: false } },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Q2 - Repeat Customers */}
      <div style={quadrantStyle}>
        <h3>Repeat Customers</h3>
        <div style={scrollableContent}>
          {repeatCustomers.map((cust, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                padding: "4px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                marginBottom: 4,
              }}
            >
              <img
                src={cust.snapshot}
                alt={cust.name}
                style={{ width: "96px", height: "64px", objectFit: "cover", borderRadius: "6px" }}
              />
              <div>
                <div style={{ fontWeight: "600" }}>{cust.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#aaa" }}>{cust.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q3 - Incidents */}
      <div style={quadrantStyle}>
        <h3>Incidents</h3>
        <div style={scrollableContent}>
          {incidents.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                marginBottom: 6,
                borderLeft: `4px solid ${severityColors[item.severity]}`,
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>{item.text}</span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  style={{
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#fbbf24",
                    color: "#fff",
                  }}
                >
                  Snooze
                </button>
                <button
                  style={{
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#ef4444",
                    color: "#fff",
                  }}
                >
                  Escalate
                </button>
                <button
                  style={{
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#10b981",
                    color: "#fff",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q4 - CCTV Monitoring */}
      <div style={quadrantStyle}>
        <h3 style={{ color: "#ffcc00" }}>CCTV Monitoring</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "8px",
            flex: 1,
            height: "100%",
          }}
        >
          {cctvFeeds.slice(0, 4).map((feed, idx) => (
            <iframe
              key={idx}
              src={feed + "?autoplay=1&mute=1"}
              title={`CCTV Feed ${idx + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: "100%",
                height: "100%",      // fills its grid cell
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

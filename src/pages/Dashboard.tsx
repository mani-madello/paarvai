import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaUserCheck, FaBell, FaUserTimes } from "react-icons/fa";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./Dashboard.css"; // for responsive grid

type Detection = {
  id: string;
  type: "Stranger" | "Valid";
  name?: string;
  location: string;
  cameraId: string;
  cameraName: string;
  time: string;
  confidence: number;
  thumb: string;
  priority: "High" | "Medium" | "Low";
  status?: "Online" | "Offline" | "Detected";
};

export default function Dashboard() {
  const LOCATIONS = ["All","Chennai","Bangalore","Delhi","Mumbai","Hyderabad","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow"];
  const [page, setPage] = useState(0);
  const activeLocation = LOCATIONS[page];

  const videoSources = [
    { id: "CAM-1", name: "Gate 1", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: "CAM-2", name: "Gate 2", src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" },
    { id: "CAM-3", name: "Lobby", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" }
  ];

  const initialDetections: Detection[] = Array.from({ length: 40 }).map((_, i) => {
    const loc = LOCATIONS[i % LOCATIONS.length];
    return {
      id: `DET-${1000 + i}`,
      type: i % 4 === 0 ? "Stranger" : "Valid",
      name: i % 4 === 0 ? undefined : ["Aarav Patel","Maya Singh","Alex Kim","Rita Bose"][i%4],
      location: loc,
      cameraId: `CAM-${(i%6)+1}`,
      cameraName: ["Gate 1","Gate 2","Lobby","Parking P2","Atrium","Food Court"][i%6],
      time: new Date(Date.now() - i*60000*5).toLocaleTimeString(),
      confidence: Math.round(70 + Math.random()*25),
      thumb: `https://picsum.photos/seed/${i+99}/92/92`,
      priority: i%5===0 ? "High" : (i%3===0 ? "Medium" : "Low"),
      status: ["Online","Offline","Detected"][i%3] as "Online"|"Offline"|"Detected"
    };
  });

  const trendData = [
    { t: "09:00", valid: 43, stranger: 5 },
    { t: "10:00", valid: 57, stranger: 9 },
    { t: "11:00", valid: 64, stranger: 7 },
    { t: "12:00", valid: 71, stranger: 12 },
    { t: "13:00", valid: 48, stranger: 4 },
    { t: "14:00", valid: 52, stranger: 6 },
  ];

  const pieData = [
    { name: "Valid", value: 289 },
    { name: "Stranger", value: 21 },
  ];

  const [detections, setDetections] = useState<Detection[]>(initialDetections);
  const [selected, setSelected] = useState<Detection | null>(initialDetections[0]);
  const [selectedCamera, setSelectedCamera] = useState(videoSources[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const playerRef = useRef<any>(null);
  const videoNodeRef = useRef<HTMLVideoElement | null>(null);

  const filtered = useMemo(() =>
    detections.filter(d =>
      (activeLocation === "All" || d.location === activeLocation) &&
      (!searchQuery || d.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedDate || new Date(d.time).toDateString() === new Date(selectedDate).toDateString())
    ), [detections, activeLocation, searchQuery, selectedDate]
  );

  useEffect(() => {
    if (!videoNodeRef.current) return;

    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.src({ src: selectedCamera.src, type: 'video/mp4' });
      playerRef.current.load();
      playerRef.current.play?.().catch(() => {});
      return;
    }

    const player = videojs(videoNodeRef.current, { autoplay: true, controls: true, muted: true });
    player.src({ src: selectedCamera.src, type: 'video/mp4' });
    playerRef.current = player;

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, [selectedCamera]);

  const headerHeight = 64;

  const quadrantStyle: React.CSSProperties = {
    overflow:'auto',
    padding:12,
    borderRadius:16,
    background:'rgba(255,255,255,0.15)',
    backdropFilter:'blur(12px)',
    display:'flex',
    flexDirection:'column',
    minHeight:0,
    gap:8,
    boxShadow:'0 8px 24px rgba(0,0,0,0.08)',
  };

  const kpiCardStyle: React.CSSProperties = {
    flex:1,
    padding:12,
    borderRadius:12,
    fontWeight:600,
    textAlign:'center',
    color:'#fff',
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    cursor:'pointer',
    transition:'all 0.3s'
  };

  return (
    <div style={{display:'flex', flexDirection:'column', background:'#f0f2f5'}}>
      {/* Fixed Header */}
      <header style={{height:headerHeight, background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'fixed', top:0, width:'100%', zIndex:10}}>
        <div style={{fontWeight:700, fontSize:20}}>PaarvAI Dashboard</div>
        <div>Welcome, Admin</div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid" style={{padding:12, paddingTop:headerHeight+12}}>
        {/* Q1: Live Detections */}
        <div style={{...quadrantStyle, height:"100%"}}>
          <div style={{display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:16, marginBottom:8}}>
            Live Detections
            <select value={activeLocation} onChange={e=>setPage(LOCATIONS.indexOf(e.target.value))} style={{borderRadius:6, padding:4}}>
              {LOCATIONS.map(loc=><option key={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Gradient KPIs */}
          <div style={{display:'flex', gap:6, marginBottom:8}}>
            <div style={{...kpiCardStyle, background:'linear-gradient(135deg,#ff6a00,#ffb347)'}}><FaUserCheck size={20}/> Total: {detections.length}</div>
            <div style={{...kpiCardStyle, background:'linear-gradient(135deg,#10b981,#6ee7b7)'}}><FaUserCheck size={20}/> Online: {detections.filter(d=>d.status==='Online').length}</div>
            <div style={{...kpiCardStyle, background:'linear-gradient(135deg,#f59e0b,#fcd34d)'}}><FaBell size={20}/> Alerts: {detections.filter(d=>d.status==='Detected').length}</div>
            <div style={{...kpiCardStyle, background:'linear-gradient(135deg,#ef4444,#fca5a5)'}}><FaUserTimes size={20}/> Offline: {detections.filter(d=>d.status==='Offline').length}</div>
          </div>

          {/* Search & Date Filter */}
          <div style={{display:'flex', gap:4, marginBottom:6}}>
            <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={{flex:1,padding:4,borderRadius:6}}/>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{flex:1,padding:4,borderRadius:6}}/>
          </div>

          {/* Detection List */}
          <div style={{flex:1, overflowY:'auto'}}>
            {filtered.map(d=>(
              <div key={d.id} onClick={()=>setSelected(d)} style={{
                display:'flex', alignItems:'center', padding:6, borderRadius:12, marginBottom:6,
                background:d.id===selected?.id?'rgba(255,106,0,0.2)':'rgba(255,255,255,0.2)',
                backdropFilter:'blur(8px)', cursor:'pointer', transition:'all 0.3s',
                boxShadow:d.id===selected?.id?'0 4px 12px rgba(255,106,0,0.3)':'0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <img src={d.thumb} style={{width:50,height:50,borderRadius:'50%', objectFit:'cover'}}/>
                <div style={{marginLeft:8, flex:1}}>
                  <div style={{fontWeight:600}}>{d.name ?? 'Unknown'}</div>
                  <div style={{fontSize:12, color:'#6b7280'}}>{d.location} — {d.time}</div>
                </div>
                <div style={{fontWeight:600, fontSize:12, color:d.status==='Online'?'#10b981':d.status==='Detected'?'#f59e0b':'#ef4444'}}>{d.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q2: Person Profile & History */}
        <div style={{...quadrantStyle, height:"100%"}}>
          <div style={{fontWeight:700, marginBottom:4}}>Person Profile & History</div>
          {selected ? (
            <div style={{flex:1, display:'flex', flexDirection:'column', gap:6}}>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                <img src={selected.thumb} style={{width:100,height:100,borderRadius:12, objectFit:'cover'}}/>
                <div>
                  <div style={{fontWeight:600}}>{selected.name ?? 'Unknown'}</div>
                  <div style={{color:'#6b7280'}}>{selected.type} • Confidence {selected.confidence}%</div>
                  <div style={{marginTop:4}}>
                    <span className="badge">{selected.location}</span> <span className="badge">{selected.cameraName}</span>
                  </div>
                </div>
              </div>
              <div style={{height:80}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="t" hide/>
                    <YAxis hide/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="valid" stroke="#10b981" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="stranger" stroke="#ef4444" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{flex:1, overflowY:'auto'}}>
                <div style={{fontWeight:600, marginBottom:4}}>Recent Visits</div>
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} style={{padding:4, borderRadius:6, background:'rgba(0,0,0,0.03)', marginBottom:4}}>
                    <div style={{fontWeight:600}}>{['Gate 1','Gate 2','Lobby','Atrium'][i%4]}</div>
                    <div style={{fontSize:12, color:'#6b7280'}}>{new Date(Date.now() - i*3600*1000).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{color:'#6b7280'}}>Select a detection from left panel.</div>}
        </div>

        {/* Q3: CCTV Playback */}
        <div style={{...quadrantStyle, height:"100%"}}>
          <div style={{fontWeight:700, marginBottom:4}}>CCTV Playback</div>
          <div style={{flex:1, borderRadius:12, overflow:'hidden'}}>
            <video
              src={selectedCamera.src}
              style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:12}}
              autoPlay muted loop controls playsInline
            />
          </div>
          <select onChange={e=>setSelectedCamera(videoSources.find(v=>v.id===e.target.value)!)} value={selectedCamera.id} style={{marginTop:8, borderRadius:6, padding:4}}>
            {videoSources.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        {/* Q4: Alerts & Analytics */}
        <div style={{...quadrantStyle, height:"100%", padding:16}}>
          <div style={{ fontWeight:700, marginBottom:12, fontSize:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Alerts & Analytics</span>
            <FaBell size={20} color="#ff5722"/>
          </div>

          {/* Gradient KPIs */}
          <div style={{ display:'flex', gap:12, marginBottom:12 }}>
            <div style={{ ...kpiCardStyle, background:'linear-gradient(135deg, #10b981, #06b6d4)' }}>Total Alerts {detections.filter(d => d.status==='Detected').length}</div>
            <div style={{ ...kpiCardStyle, background:'linear-gradient(135deg, #ef4444, #f87171)' }}>High Priority {detections.filter(d => d.priority==='High').length}</div>
            <div style={{ ...kpiCardStyle, background:'linear-gradient(135deg, #fbbf24, #facc15)' }}>Medium Priority {detections.filter(d => d.priority==='Medium').length}</div>
            <div style={{ ...kpiCardStyle, background:'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>Low Priority {detections.filter(d => d.priority==='Low').length}</div>
          </div>

          {/* Recent Alerts */}
          <div style={{flex:1, overflowY:'auto'}}>
            {detections.slice(0,10).map(d=>(
              <div key={d.id} style={{padding:8, borderRadius:12, background:'rgba(0, 0, 0, 0.03)', marginBottom:6, display:'flex', justifyContent:'space-between', alignItems:'center', transition:'0.2s', cursor:'pointer'}}>
                <div style={{display:'flex', gap:6, alignItems:'center'}}>
                  {d.type==='Stranger'?<FaUserTimes color="#ef4444"/>:<FaUserCheck color="#10b981"/>}
                  <span>{d.type==='Stranger'?'Unknown':'Known'} • {d.cameraName}</span>
                </div>
                <div style={{fontWeight:500, color:'#18181b'}}>ID {d.id}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{display:'flex', gap:12, marginTop:8}}>
            <div style={{flex:1, height:150}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="t" stroke="#9ca3af"/>
                  <YAxis stroke="#9ca3af"/>
                  <Tooltip contentStyle={{background:'rgba(0,0,0,0.7)', borderRadius:8, border:'none'}}/>
                  <Line type="monotone" dataKey="valid" stroke="#10b981" strokeWidth={3} dot={{r:3}}/>
                  <Line type="monotone" dataKey="stranger" stroke="#ef4444" strokeWidth={3} dot={{r:3}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{width:150, height:150}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={30} outerRadius={60} paddingAngle={2}>
                    {pieData.map((entry, idx)=><Cell key={idx} fill={['#10b981','#ef4444','#fbbf24','#3b82f6'][idx%4]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'rgba(0,0,0,0.7)', borderRadius:8, border:'none'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

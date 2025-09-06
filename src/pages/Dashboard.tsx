import React, { useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import videojs from "video.js";
import "video.js/dist/video-js.css";

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
};

const LOCATIONS = ["Chennai","Bangalore","Delhi","Mumbai","Hyderabad","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow"];

const initialDetections: Detection[] = Array.from({ length: 24 }).map((_, i) => {
  const isStranger = i % 4 === 0;
  const loc = LOCATIONS[i % LOCATIONS.length];
  return {
    id: `DET-${1000 + i}`,
    type: isStranger ? "Stranger" : "Valid",
    name: isStranger ? undefined : ["Aarav Patel","Maya Singh","Alex Kim","Rita Bose"][i%4],
    location: loc,
    cameraId: `CAM-${(i%6)+1}`,
    cameraName: ["Gate 1","Gate 2","Lobby","Parking P2","Atrium","Food Court"][i%6],
    time: new Date(Date.now() - i * 1000 * 60 * 5).toLocaleTimeString(),
    confidence: Math.round(75 + Math.random()*22),
    thumb: `https://picsum.photos/seed/${i+99}/92/92`,
    priority: i%5===0 ? "High" : (i%3===0 ? "Medium" : "Low")
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

const videoSources = [
  { id: "CAM-1", name: "Gate 1", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "CAM-2", name: "Gate 2", src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" },
  { id: "CAM-3", name: "Lobby", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" }
];

export default function Dashboard() {
  const [page, setPage] = useState(0);
  const [detections, setDetections] = useState<Detection[]>(initialDetections);
  const [selected, setSelected] = useState<Detection | null>(initialDetections[1] || null);
  const [selectedCamera, setSelectedCamera] = useState(videoSources[0]);
  const playerRef = useRef<any>(null);
  const videoNodeRef = useRef<HTMLVideoElement | null>(null);

  // pagination (1 location per page)
  const totalPages = LOCATIONS.length;
  const activeLocation = LOCATIONS[page];
  const filtered = useMemo(() => detections.filter(d => d.location === activeLocation), [detections, activeLocation]);

  // simulate incoming detections (live stream)
  useEffect(() => {
    const t = setInterval(() => {
      setDetections(prev => {
        const i = Math.floor(Math.random()*1000);
        const newDet: Detection = {
          id: `DET-${2000 + Math.floor(Math.random()*9000)}`,
          type: Math.random() > 0.6 ? "Stranger" : "Valid",
          name: Math.random() > 0.6 ? ["Samir","Neha","Rohit"][Math.floor(Math.random()*3)] : undefined,
          location: LOCATIONS[Math.floor(Math.random()*LOCATIONS.length)],
          cameraId: `CAM-${Math.floor(Math.random()*6)+1}`,
          cameraName: ["Gate 1","Gate 2","Lobby","Parking P2","Atrium","Food Court"][Math.floor(Math.random()*6)],
          time: new Date().toLocaleTimeString(),
          confidence: Math.round(70 + Math.random()*25),
          thumb: `https://picsum.photos/seed/${Math.floor(Math.random()*999)}/92/92`,
          priority: Math.random() > 0.8 ? "High" : (Math.random()>0.5 ? "Medium" : "Low")
        };
        const out = [newDet, ...prev];
        return out.slice(0, 120);
      });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // video.js player init
  useEffect(() => {
    if (!videoNodeRef.current) return;
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.src({ src: selectedCamera.src, type: 'video/mp4' });
      playerRef.current.load();
      playerRef.current.play().catch(() => {});
      return;
    }
    const player = videojs(videoNodeRef.current, { autoplay: true, controls: true, muted: true });
    player.src({ src: selectedCamera.src, type: 'video/mp4' });
    player.play().catch(()=>{});
    playerRef.current = player;
    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, [selectedCamera]);

  return (
    <div className="grid-2x2">
      {/* Q1: detections */}
      <div className="card" style={{minHeight:0}}>
        <div className="card-head">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{fontWeight:700}}>Live Detections</div>
            <div className="badge">{activeLocation}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button className="btn small" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>Prev</button>
            <div style={{fontSize:13}}>Page <b>{page+1}</b> of <b>{totalPages}</b></div>
            <button className="btn small" onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1}>Next</button>
          </div>
        </div>
        <div className="card-body" style={{paddingTop:0}}>
          <div style={{display:'flex',gap:12,marginBottom:8,alignItems:'center'}}>
            <input placeholder="Search name, camera or id" className="small" style={{flex:1}} onChange={(e)=>{/* stub */}} />
            <select className="small" onChange={(e)=>setPage(Number(e.target.value))} value={page}>
              {LOCATIONS.map((l,idx)=>(<option key={l} value={idx}>{l}</option>))}
            </select>
          </div>
          <div style={{overflow:'auto',maxHeight:'calc(100% - 88px)'}}>
            {filtered.map(d=>(
              <div key={d.id} className="detection-item" onClick={()=>setSelected(d)} style={{border:d.id===selected?.id?'1px solid rgba(255,106,0,0.6)':''}}>
                <img src={d.thumb} style={{width:56,height:56,borderRadius:8,objectFit:'cover'}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'space-between'}}>
                    <div style={{fontWeight:600}}>{d.name ?? 'Unknown'}</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>{d.time}</div>
                  </div>
                  <div style={{fontSize:13,color:'var(--muted)',display:'flex',gap:10,marginTop:6}}>
                    <div><span className="status-dot" style={{background:d.type==='Stranger'?'#ff5252':'#10b981'}}></span>{d.type}</div>
                    <div>• {d.cameraName}</div>
                    <div>• {d.confidence}%</div>
                    <div style={{marginLeft:'auto'}}><span className={`badge ${d.priority==='High'?'badge-red':d.priority==='Medium'?'badge-yellow':'badge-green'}`}>{d.priority}</span></div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length===0 && <div style={{padding:12,color:'var(--muted)'}}>No detections for this location.</div>}
          </div>
        </div>
      </div>

      {/* Q2: Profile & History */}
      <div className="card">
        <div className="card-head"><div style={{fontWeight:700}}>Person Profile & History</div></div>
        <div className="card-body">
          {selected ? (
            <div style={{display:'flex',gap:16}}>
              <div style={{width:180}}>
                <img src={selected.thumb} style={{width:160,height:160,borderRadius:12,objectFit:'cover'}}/>
                <div style={{marginTop:12}}>
                  <div style={{fontWeight:700,fontSize:18}}>{selected.name ?? 'Unknown Person'}</div>
                  <div style={{color:'var(--muted)',marginTop:6}}>{selected.type} • Confidence {selected.confidence}%</div>
                  <div style={{marginTop:8}}>
                    <div className="small badge" style={{display:'inline-block',marginRight:8}}>{selected.location}</div>
                    <div className="small badge">{selected.cameraName}</div>
                  </div>
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontWeight:600}}>Recent Visits</div>
                  <div style={{fontSize:13,color:'var(--muted)'}}>Total seen: {Math.floor(Math.random()*12)+1}</div>
                </div>
                <div style={{marginTop:8,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {Array.from({length:6}).map((_,i)=>(
                    <div key={i} style={{padding:10,borderRadius:10,background:'rgba(0,0,0,0.03)'}}>
                      <div style={{fontWeight:600}}>{['Gate 1','Gate 2','Lobby','Atrium'][i%4]}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{new Date(Date.now() - i*3600*1000).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12}}>
                  <div style={{fontWeight:700}}>Actions</div>
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <button className="btn btn-primary">Notify Security</button>
                    <button className="btn">Create Incident</button>
                    <button className="btn">Add to Watchlist</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{color:'var(--muted)'}}>Select a detection from the left panel to view profile and visit history.</div>
          )}
        </div>
      </div>

      {/* Q3: CCTV playback */}
      <div className="card">
        <div className="card-head">
          <div style={{fontWeight:700}}>CCTV Playback</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <select className="small" onChange={(e)=>{
              const cam = videoSources.find(v=>v.id===e.target.value);
              if(cam) setSelectedCamera(cam);
            }} value={selectedCamera.id}>
              {videoSources.map(v=>(<option key={v.id} value={v.id}>{v.name}</option>))}
            </select>
          </div>
        </div>
        <div className="card-body" style={{padding:0}}>
          <div className="video-wrap" style={{height:'100%'}}>
            <video ref={videoNodeRef as any} className="video-js vjs-default-skin" playsInline/>
          </div>
        </div>
      </div>

      {/* Q4: Actions & Analytics */}
      <div className="card">
        <div className="card-head"><div style={{fontWeight:700}}>Alerts & Analytics</div></div>
        <div className="card-body">
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <div style={{flex:1}} className="p-2" >
              <div style={{fontWeight:600,marginBottom:8}}>Active Alerts</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {detections.slice(0,6).map(d=>(
                  <div key={d.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:8,borderRadius:8,background:'rgba(0,0,0,0.03)'}}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <div style={{width:10,height:10,borderRadius:99,background:d.priority==='High'?'#ff5252':d.priority==='Medium'?'#ff8a00':'#10b981'}}></div>
                      <div style={{fontWeight:600}}>{d.type==='Stranger'?'Unknown':'Known'}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{d.cameraName} • {d.location}</div>
                    </div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>ID {d.id}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{width:320}} className="p-2">
              <div style={{fontWeight:600,marginBottom:8}}>Detections Trend</div>
              <div style={{height:160}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="t" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="valid" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="stranger" stroke="#ff5252" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{marginTop:12}}>
                <div style={{fontWeight:600,marginBottom:8}}>Valid vs Stranger</div>
                <div style={{height:120}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={30} outerRadius={50} label>
                        {pieData.map((_,idx)=>(<Cell key={idx} />))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop:8,fontSize:12,color:'var(--muted)'}}>Tip: Click a detection to view profile, then switch camera to play associated footage. Alerts color coded by priority.</div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function App(){
  const [dark,setDark]=useState(true)
  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
  },[dark])
  return (
    <div style={{height:'100%'}}>
      <header className="header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/src/assets/logo.svg" alt="logo" style={{height:40}}/>
          <div>
            <div style={{fontWeight:700}}>PaarvAI Dashboard</div>
            <div style={{fontSize:12,color:'var(--muted)'}}>Face Recognition Command Center</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button className="btn small" onClick={()=>setDark(d=>!d)}>{dark? 'Light' : 'Dark'} Theme</button>
        </div>
      </header>
      <main className="container">
        <Outlet/>
      </main>
      <footer className="footer">Powered by Madello</footer>
    </div>
  )
}
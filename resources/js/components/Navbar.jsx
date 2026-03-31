import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: "#f28b8b",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}>
      <div style={{ display: "flex", gap: "32px" }}>
        {["Home", "Donor", "Donate", "Ask AI"].map(link => {
          const path = link === "Home" ? "/" : `/${link.toLowerCase().replace(' ', '')}`;
          return (
            <Link key={link} to={path} style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}>{link}</Link>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {["Volunteers", "Contact"].map(link => {
          const path = `/${link.toLowerCase().replace('s', '')}`;
          return (
            <Link key={link} to={path} style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}>{link}</Link>
          );
        })}
        <Link to="/donate" style={{
          backgroundColor: "#c0392b",
          color: "#fff",
          textDecoration: "none",
          padding: "8px 18px",
          borderRadius: "6px",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          fontFamily: "sans-serif",
          transition: "background 0.2s",
        }} onMouseOver={e => e.target.style.backgroundColor = "#a93226"}
           onMouseOut={e => e.target.style.backgroundColor = "#c0392b"}>
          Donate Now
        </Link>
      </div>
    </nav>
  );
}

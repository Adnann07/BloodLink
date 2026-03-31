import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

const NAV_LINKS = ["Home", "Donor", "Donate", "Ask AI", "Volunteers", "Contact"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a", margin: 0, padding: 0 }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 80px",
        minHeight: "420px",
        backgroundColor: "#fff",
      }}>
        <div style={{ maxWidth: "480px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "20px",
            fontFamily: "'Georgia', serif",
          }}>Give Blood, Save Lives</h1>
          <p style={{
            fontSize: "16px",
            color: "#555",
            lineHeight: 1.7,
            marginBottom: "36px",
            fontFamily: "sans-serif",
          }}>
            Your one drop of blood can change someone's entire world. Join thousands of heroes making a difference every day.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link to="/donate" style={{
              backgroundColor: "#c0392b",
              color: "#fff",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              fontFamily: "sans-serif",
              display: "inline-block",
            }}>Donate Now</Link>
            <button style={{
              backgroundColor: "#fff",
              color: "#c0392b",
              border: "2px solid #c0392b",
              padding: "14px 28px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              fontFamily: "sans-serif",
            }}>Learn More</button>
          </div>
        </div>

        {/* Logo / Illustration */}
        <div style={{ textAlign: "center" }}>
          <svg width="200" height="220" viewBox="0 0 200 220">
            {/* Hands */}
            <g fill="#444">
              <ellipse cx="70" cy="190" rx="40" ry="18" />
              <ellipse cx="130" cy="190" rx="40" ry="18" />
              <rect x="45" y="130" width="30" height="65" rx="15" />
              <rect x="125" y="130" width="30" height="65" rx="15" />
              <rect x="55" y="110" width="12" height="40" rx="6" />
              <rect x="70" y="100" width="12" height="50" rx="6" />
              <rect x="118" y="100" width="12" height="50" rx="6" />
              <rect x="133" y="110" width="12" height="40" rx="6" />
            </g>
            {/* Blood drop */}
            <path d="M100 30 C100 30 65 80 65 105 C65 123 81 138 100 138 C119 138 135 123 135 105 C135 80 100 30 100 30Z" fill="#c0392b" />
            <ellipse cx="88" cy="108" rx="8" ry="12" fill="rgba(255,255,255,0.3)" />
          </svg>
          <div style={{ fontFamily: "sans-serif" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "3px", color: "#1a1a1a" }}>BLOODLINK</div>
            <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Connecting Lives, Saving Hope</div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section style={{ padding: "60px 80px", backgroundColor: "#fff", textAlign: "center" }}>
        <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "12px", fontFamily: "'Georgia', serif" }}>
          Why Donate Blood?
        </h2>
        <p style={{ color: "#777", fontSize: "16px", marginBottom: "48px", fontFamily: "sans-serif" }}>
          Every donation makes a real difference
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
          {[
            { icon: "❤️", title: "Save Lives", desc: "One donation can save up to three lives. Your contribution directly impacts patients in need." },
            { icon: "🩸", title: "Always Needed", desc: "Blood cannot be manufactured. Regular donations ensure hospitals have emergency supply." },
            { icon: "👥", title: "Build Community", desc: "Join a network of compassionate donors. Be part of something bigger than yourself." },
            { icon: "💓", title: "Health Benefits", desc: "Regular donation can improve cardiovascular health and provide free health screenings." },
          ].map(card => (
            <div key={card.title} style={{ textAlign: "left" }}>
              <div style={{
                width: "52px", height: "52px",
                backgroundColor: "#fde8e8",
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px",
                marginBottom: "16px",
              }}>{card.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px", fontFamily: "sans-serif" }}>{card.title}</h3>
              <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.6, fontFamily: "sans-serif" }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Impact Section */}
      <section style={{ padding: "60px 80px", backgroundColor: "#f9f9f9", textAlign: "center" }}>
        <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "12px", fontFamily: "'Georgia', serif" }}>
          Our Impact
        </h2>
        <p style={{ color: "#777", fontSize: "16px", marginBottom: "48px", fontFamily: "sans-serif" }}>
          Making a difference, one donation at a time.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          {[
            { number: "10,000+", label: "Lives Saved" },
            { number: "5,000+", label: "Active Donors" },
            { number: "200+", label: "Partner Hospitals" },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: "42px", fontWeight: 900, color: "#c0392b", fontFamily: "'Georgia', serif" }}>{stat.number}</div>
              <div style={{ color: "#555", fontSize: "16px", marginTop: "8px", fontFamily: "sans-serif" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#1a1a1a",
        color: "#aaa",
        textAlign: "center",
        padding: "24px",
        fontSize: "14px",
        fontFamily: "sans-serif",
      }}>
        © 2026 BloodLink — Connecting Lives, Saving Hope
      </footer>
    </div>
  );
}
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Donate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    date: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Thank you for signing up to donate! 🩸 You are a hero!");
  };

  return (
    <div style={{ fontFamily: "sans-serif", color: "#1a1a1a", margin: 0, padding: 0 }}>

      {/* Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <section style={{
        backgroundColor: "#fde8e8",
        padding: "60px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{
            fontSize: "44px", fontWeight: 800,
            fontFamily: "'Georgia', serif",
            marginBottom: "16px", lineHeight: 1.2,
          }}>Be Someone's Hero Today</h1>
          <p style={{ fontSize: "16px", color: "#555", maxWidth: "460px", lineHeight: 1.7 }}>
            One donation takes less than an hour but can save up to three lives.
            Fill in the form below and schedule your donation appointment.
          </p>
        </div>
        <div style={{ fontSize: "90px" }}>🩸</div>
      </section>

      {/* Blood Type Info Bar */}
      <section style={{
        backgroundColor: "#c0392b",
        padding: "20px 80px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
          <div key={type} style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: "20px",
            fontWeight: 700,
            fontSize: "15px",
          }}>{type}</div>
        ))}
      </section>

      {/* Main Content */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "48px",
        padding: "60px 80px",
        backgroundColor: "#fff",
      }}>

        {/* Form */}
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, fontFamily: "'Georgia', serif", marginBottom: "8px" }}>
            Schedule a Donation
          </h2>
          <p style={{ color: "#777", marginBottom: "32px", fontSize: "15px" }}>
            Fill in your details and we'll confirm your appointment.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
              { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com" },
              { label: "Phone Number", name: "phone", type: "tel", placeholder: "+1 234 567 8900" },
              { label: "Preferred Date", name: "date", type: "date", placeholder: "" },
              { label: "Nearest Location", name: "location", type: "text", placeholder: "City or hospital name" },
            ].map(field => (
              <div key={field.name}>
                <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1.5px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={e => e.target.style.border = "1.5px solid #c0392b"}
                  onBlur={e => e.target.style.border = "1.5px solid #ddd"}
                />
              </div>
            ))}

            {/* Blood Type Select */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Blood Type
              </label>
              <select
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#fff",
                }}
              >
                <option value="">Select your blood type</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#c0392b",
                color: "#fff",
                border: "none",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "8px",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.target.style.backgroundColor = "#a93226"}
              onMouseOut={e => e.target.style.backgroundColor = "#c0392b"}
            >
              Schedule My Donation 🩸
            </button>
          </div>
        </div>

        {/* Right Side Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Eligibility */}
          <div style={{
            backgroundColor: "#fde8e8",
            borderRadius: "12px",
            padding: "32px",
          }}>
            <h3 style={{ fontWeight: 800, fontSize: "20px", marginBottom: "16px", fontFamily: "'Georgia', serif" }}>
              Am I Eligible?
            </h3>
            {[
              "✅ Age 18–65 years old",
              "✅ Weight at least 50kg",
              "✅ No recent illness or infection",
              "✅ Not donated in the last 3 months",
              "✅ No tattoos in the last 6 months",
            ].map(item => (
              <p key={item} style={{ fontSize: "14px", color: "#444", marginBottom: "10px", lineHeight: 1.5 }}>{item}</p>
            ))}
          </div>

          {/* What to expect */}
          <div style={{
            border: "1.5px solid #eee",
            borderRadius: "12px",
            padding: "32px",
          }}>
            <h3 style={{ fontWeight: 800, fontSize: "20px", marginBottom: "16px", fontFamily: "'Georgia', serif" }}>
              What to Expect
            </h3>
            {[
              { step: "1", text: "Registration & health check (10 mins)" },
              { step: "2", text: "The actual donation (8–10 mins)" },
              { step: "3", text: "Rest & refreshments (15 mins)" },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" }}>
                <div style={{
                  width: "32px", height: "32px",
                  backgroundColor: "#c0392b",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                  flexShrink: 0,
                }}>{item.step}</div>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.6, marginTop: "6px" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#1a1a1a",
        color: "#aaa",
        textAlign: "center",
        padding: "24px",
        fontSize: "14px",
      }}>
        © 2026 BloodLink — Connecting Lives, Saving Hope
      </footer>
    </div>
  );
}
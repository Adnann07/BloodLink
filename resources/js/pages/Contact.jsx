import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('/api/messages', formData);
      if (response.data.success) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ full_name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Failed to send message. Please try again.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <h1 style={{ color: "#c0392b", textAlign: "center", marginBottom: "10px", fontSize: "32px" }}>Contact Us</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "40px" }}>Have questions? We'd love to hear from you.</p>

        {status.message && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
            color: status.type === 'success' ? '#155724' : '#721c24',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="How can we help?"
              rows="5"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", resize: "vertical" }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              backgroundColor: loading ? "#e6b0aa" : "#c0392b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s, background-color 0.2s"
            }}
            onMouseOver={e => !loading && (e.target.style.backgroundColor = "#a93226")}
            onMouseOut={e => !loading && (e.target.style.backgroundColor = "#c0392b")}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", textAlign: "center" }}>
          <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <h3 style={{ color: "#c0392b", marginBottom: "5px" }}>Email Us</h3>
            <p style={{ color: "#666" }}>info@bloodlink.com</p>
          </div>
          <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <h3 style={{ color: "#c0392b", marginBottom: "5px" }}>Call Us</h3>
            <p style={{ color: "#666" }}>+880 1234 567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
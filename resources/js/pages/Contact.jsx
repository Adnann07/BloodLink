import React from 'react';

export default function Contact() {
    return (
        <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '60px auto', padding: '20px' }}>
            <h1 style={{ color: '#c0392b' }}>Contact Us</h1>
            <p>Have questions? We'd love to hear from you.</p>
            <form>
                <div style={{ marginBottom: '15px' }}>
                    <label>Your Name</label><br />
                    <input type="text" placeholder="Enter your name" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email</label><br />
                    <input type="email" placeholder="Enter your email" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Message</label><br />
                    <textarea placeholder="Write your message..." rows="5" style={{ width: '100%', padding: '10px', marginTop: '5px' }}></textarea>
                </div>
                <button type="submit" style={{ backgroundColor: '#c0392b', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    Send Message
                </button>
            </form>
            <div style={{ marginTop: '40px', color: '#555' }}>
                <p>📧 bloodlink@gmail.com</p>
                <p>📞 +880 1234 567890</p>
                <p>📍 Dhaka, Bangladesh</p>
            </div>
        </div>
    );
}
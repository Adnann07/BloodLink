import React from 'react';

export default function Volunteer() {
    return (
        <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '60px auto', padding: '20px' }}>
            <h1 style={{ color: '#c0392b' }}>Become a Volunteer</h1>
            <p>Join our team and help save lives by supporting blood donation drives.</p>
            <form>
                <div style={{ marginBottom: '15px' }}>
                    <label>Full Name</label><br />
                    <input type="text" placeholder="Enter your name" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email</label><br />
                    <input type="email" placeholder="Enter your email" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone Number</label><br />
                    <input type="tel" placeholder="Enter your phone" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Availability</label><br />
                    <select style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                        <option>Weekdays</option>
                        <option>Weekends</option>
                        <option>Both</option>
                    </select>
                </div>
                <button type="submit" style={{ backgroundColor: '#c0392b', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    Sign Up as Volunteer
                </button>
            </form>
        </div>
    );
}
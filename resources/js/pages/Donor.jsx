import React from 'react';

export default function Donor() {
    return (
        <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '60px auto', padding: '20px' }}>
            <h1 style={{ color: '#c0392b' }}>Register as a Blood Donor</h1>
            <p>Your donation can save up to 3 lives. Register today.</p>
            <form>
                <div style={{ marginBottom: '15px' }}>
                    <label>Full Name</label><br />
                    <input type="text" placeholder="Enter your name" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Blood Group</label><br />
                    <select style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Age</label><br />
                    <input type="number" placeholder="Enter your age" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>City</label><br />
                    <input type="text" placeholder="Enter your city" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone Number</label><br />
                    <input type="tel" placeholder="Enter your phone" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ backgroundColor: '#c0392b', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    Register as Donor
                </button>
            </form>
        </div>
    );
}
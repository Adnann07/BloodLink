import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Volunteer() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        availability: 'Weekdays'
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Signing up...' });
        try {
            const response = await axios.post('/api/volunteers', formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: 'Successfully signed up as a volunteer!' });
                setFormData({ full_name: '', email: '', phone: '', availability: 'Weekdays' });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'An error occurred during signup.';
            setStatus({ type: 'error', message: errorMsg });
        }
    };

    return (
        <div style={{ fontFamily: 'Arial', margin: 0, padding: 0 }}>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '60px auto', padding: '20px' }}>
                <h1 style={{ color: '#c0392b' }}>Become a Volunteer</h1>
                <p>Join our team and help save lives by supporting blood donation drives.</p>
                
                {status.message && (
                    <div style={{ 
                        padding: '10px', 
                        marginBottom: '20px', 
                        borderRadius: '5px',
                        backgroundColor: status.type === 'success' ? '#d4edda' : (status.type === 'error' ? '#f8d7da' : '#eee'),
                        color: status.type === 'success' ? '#155724' : (status.type === 'error' ? '#721c24' : '#666')
                    }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Full Name</label><br />
                        <input name="full_name" type="text" value={formData.full_name} onChange={handleChange} required placeholder="Enter your name" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Email</label><br />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Phone Number</label><br />
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter your phone" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Availability</label><br />
                        <select name="availability" value={formData.availability} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                            <option>Weekdays</option>
                            <option>Weekends</option>
                            <option>Both</option>
                        </select>
                    </div>
                    <button type="submit" disabled={status.type === 'loading'} style={{ backgroundColor: '#c0392b', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', borderRadius: '5px', opacity: status.type === 'loading' ? 0.7 : 1 }}>
                        {status.type === 'loading' ? 'Signing up...' : 'Sign Up as Volunteer'}
                    </button>
                </form>
            </div>
        </div>
    );
}
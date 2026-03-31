import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Donor() {
    const [formData, setFormData] = useState({
        full_name: '',
        blood_group: 'A+',
        age: '',
        city: '',
        phone: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Registering...' });
        try {
            const response = await axios.post('/api/donors', formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: 'Successfully registered as a donor!' });
                setFormData({ full_name: '', blood_group: 'A+', age: '', city: '', phone: '' });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'An error occurred during registration.';
            setStatus({ type: 'error', message: errorMsg });
        }
    };

    return (
        <div style={{ fontFamily: 'Arial', margin: 0, padding: 0 }}>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '60px auto', padding: '20px' }}>
                <h1 style={{ color: '#c0392b' }}>Register as a Blood Donor</h1>
                <p>Your donation can save up to 3 lives. Register today.</p>
                
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
                        <label>Blood Group</label><br />
                        <select name="blood_group" value={formData.blood_group} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
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
                        <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Enter your age" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>City</label><br />
                        <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="Enter your city" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Phone Number</label><br />
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter your phone" style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <button type="submit" disabled={status.type === 'loading'} style={{ backgroundColor: '#c0392b', color: 'white', padding: '12px 30px', border: 'none', cursor: 'pointer', borderRadius: '5px', opacity: status.type === 'loading' ? 0.7 : 1 }}>
                        {status.type === 'loading' ? 'Registering...' : 'Register as Donor'}
                    </button>
                </form>
            </div>
        </div>
    );
}
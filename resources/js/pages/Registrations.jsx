import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Registrations() {
    const [data, setData] = useState({ donors: [], volunteers: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/registrations');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const tableHeaderStyle = {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #eee',
        backgroundColor: '#f9f9f9',
        color: '#c0392b',
        fontWeight: 'bold'
    };

    const tableCellStyle = {
        padding: '12px',
        borderBottom: '1px solid #eee'
    };

    if (loading) {
        return (
            <div style={{ fontFamily: 'Arial' }}>
                <Navbar />
                <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading registrations...</div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'Arial', margin: 0, padding: 0, backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <Navbar />
            
            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
                <h1 style={{ color: '#c0392b', marginBottom: '30px' }}>Admin Dashboard: Registrations</h1>
                
                {/* Donors Table */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ color: '#333', borderLeft: '5px solid #c0392b', paddingLeft: '15px' }}>Registered Donors</h2>
                    <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>ID</th>
                                    <th style={tableHeaderStyle}>Name</th>
                                    <th style={tableHeaderStyle}>Blood Group</th>
                                    <th style={tableHeaderStyle}>Age</th>
                                    <th style={tableHeaderStyle}>City</th>
                                    <th style={tableHeaderStyle}>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.donors.length > 0 ? data.donors.map(donor => (
                                    <tr key={donor.id}>
                                        <td style={tableCellStyle}>{donor.id}</td>
                                        <td style={tableCellStyle}>{donor.full_name}</td>
                                        <td style={tableCellStyle}><span style={{ background: '#f8d7da', color: '#c0392b', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{donor.blood_group}</span></td>
                                        <td style={tableCellStyle}>{donor.age}</td>
                                        <td style={tableCellStyle}>{donor.city}</td>
                                        <td style={tableCellStyle}>{donor.phone}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" style={{ ...tableCellStyle, textAlign: 'center', color: '#888' }}>No donors registered yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Volunteers Table */}
                <section>
                    <h2 style={{ color: '#333', borderLeft: '5px solid #2ecc71', paddingLeft: '15px' }}>Registered Volunteers</h2>
                    <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>ID</th>
                                    <th style={tableHeaderStyle}>Name</th>
                                    <th style={tableHeaderStyle}>Email</th>
                                    <th style={tableHeaderStyle}>Phone</th>
                                    <th style={tableHeaderStyle}>Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.volunteers.length > 0 ? data.volunteers.map(v => (
                                    <tr key={v.id}>
                                        <td style={tableCellStyle}>{v.id}</td>
                                        <td style={tableCellStyle}>{v.full_name}</td>
                                        <td style={tableCellStyle}>{v.email}</td>
                                        <td style={tableCellStyle}>{v.phone}</td>
                                        <td style={tableCellStyle}><span style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '4px' }}>{v.availability}</span></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" style={{ ...tableCellStyle, textAlign: 'center', color: '#888' }}>No volunteers registered yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}

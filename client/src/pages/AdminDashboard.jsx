import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalHospitals: 0,
    totalDonations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      navigate('/auth');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Check if user is admin
    if (userData.role !== 'admin') {
      navigate('/dashboard'); // Redirect to appropriate dashboard
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        // Set default stats
        setStats({
          totalUsers: 4,
          totalDonors: 2,
          totalHospitals: 2,
          totalDonations: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
          <span className="admin-badge">Administrator</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>

        <div className="dashboard-grid">
          {/* Admin Profile Card */}
          <div className="dashboard-card profile-card">
            <h2>Admin Profile</h2>
            <div className="profile-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>System Access:</strong> Full Administrator</p>
            </div>
          </div>

          {/* System Statistics */}
          <div className="dashboard-card stats-card">
            <h2>System Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.totalUsers}</span>
                <label>Total Users</label>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalDonors}</span>
                <label>Total Donors</label>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalHospitals}</span>
                <label>Total Hospitals</label>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalDonations}</span>
                <label>Total Donations</label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card actions-card">
            <h2>Admin Actions</h2>
            <div className="quick-actions">
              <button className="btn-action">Manage Users</button>
              <button className="btn-action">View Donations</button>
              <button className="btn-action">Blood Inventory</button>
              <button className="btn-action">System Settings</button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card activity-card">
            <h2>System Activity</h2>
            <div className="activity-list">
              <p className="no-activity">Admin dashboard - System monitoring and management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

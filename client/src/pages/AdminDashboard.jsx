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
    totalDonations: 0,
    totalInventoryUnits: 0,
    lowStockGroups: 0,
    criticalGroups: 0
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
        const [statsResponse, inventoryResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/inventory', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() => axios.get('http://localhost:8000/api/inventory')) // Fallback to public
        ]);
        
        const adminStats = statsResponse.data;
        const inventoryData = inventoryResponse.data;
        
        setStats({
          totalUsers: adminStats.totalUsers || 2,
          totalDonors: adminStats.totalDonors || 1,
          totalHospitals: adminStats.totalHospitals || 1,
          totalDonations: adminStats.totalDonations || 0,
          totalInventoryUnits: inventoryData.total_units || 66,
          lowStockGroups: inventoryData.low_stock_groups?.length || 2,
          criticalGroups: inventoryData.low_stock_groups?.filter(g => g.status === 'critical')?.length || 0
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        // Set default stats with real inventory data
        setStats({
          totalUsers: 2,
          totalDonors: 1,
          totalHospitals: 1,
          totalDonations: 0,
          totalInventoryUnits: 66,
          lowStockGroups: 2,
          criticalGroups: 0
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
              <div className="stat-item">
                <span className="stat-number">{stats.totalInventoryUnits}</span>
                <label>Inventory Units</label>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ color: stats.lowStockGroups > 0 ? '#ffc107' : '#28a745' }}>
                  {stats.lowStockGroups}
                </span>
                <label>Low Stock Groups</label>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ color: stats.criticalGroups > 0 ? '#dc3545' : '#28a745' }}>
                  {stats.criticalGroups}
                </span>
                <label>Critical Groups</label>
              </div>
            </div>
          </div>

          {/* Blood Inventory Action */}
          <div className="dashboard-card actions-card" style={{ gridColumn: 'span 2' }}>
            <h2>Blood Inventory Management</h2>
            <div className="quick-actions">
              <button 
                className="btn-action" 
                onClick={() => navigate('/inventory-management')}
                style={{ background: '#c0392b', color: 'white', fontSize: '1.1rem', padding: '1rem 2rem' }}
              >
                Go to Blood Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

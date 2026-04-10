import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import axios from 'axios';

function HospitalDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState({});
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

    // Check if user is hospital
    if (userData.role !== 'hospital') {
      navigate('/dashboard'); // Redirect to donor dashboard
      return;
    }
    
    // Fetch fresh user data with profile and inventory
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Update localStorage and state with fresh data
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        setUser(userResponse.data);
        
        // Fetch blood inventory
        const inventoryResponse = await axios.get('http://localhost:8000/api/inventory');
        setInventory(inventoryResponse.data.inventory || {});
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'hospital') {
    return <div>Access denied</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>

        <div className="dashboard-grid">
          {/* Hospital Profile Card */}
          <div className="dashboard-card profile-card">
            <h2>Hospital Profile</h2>
            <div className="profile-info">
              <p><strong>Hospital Name:</strong> {user.hospitalProfile?.hospital_name || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>License Number:</strong> {user.hospitalProfile?.license_number || 'Not provided'}</p>
              <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
              <p><strong>City:</strong> {user.hospitalProfile?.city || 'Not provided'}</p>
            </div>
          </div>

          {/* Blood Groups Availability */}
          <div className="dashboard-card blood-availability-card" style={{ gridColumn: 'span 2' }}>
            <h2>Blood Groups Availability</h2>
            <div className="blood-groups-grid">
              {Object.entries(inventory).length > 0 ? (
                Object.entries(inventory).map(([group, data]) => (
                  <div key={group} className="blood-group-item" style={{ 
                    padding: '1rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    background: data.status === 'critical' ? '#fee' : data.status === 'low' ? '#ffeaa7' : '#f0f8ff'
                  }}>
                    <span className="blood-type" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c0392b' }}>{group}</span>
                    <div className="blood-stats" style={{ marginTop: '0.5rem' }}>
                      <span className="available" style={{ display: 'block', fontWeight: 'bold' }}>
                        {data.available_units} units
                      </span>
                      <span className="status" style={{ 
                        display: 'block', 
                        fontSize: '0.85rem',
                        color: data.status === 'critical' ? '#dc3545' : data.status === 'low' ? '#ffc107' : '#28a745'
                      }}>
                        Status: {data.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No inventory data available</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HospitalDashboard;

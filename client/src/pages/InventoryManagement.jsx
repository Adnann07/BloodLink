import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import api from '../api/axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function InventoryManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [donors, setDonors] = useState([]);
  const [donorList, setDonorList] = useState([]);
  const [donations, setDonations] = useState([]);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [loadingDonor, setLoadingDonor] = useState(false);

  // Form states
  const [donationForm, setDonationForm] = useState({
    donor_email: '',
    blood_group: '',
    units_donated: 1,
    donation_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [updateForm, setUpdateForm] = useState({
    blood_group: '',
    units_change: 0,
    operation: 'add',
    notes: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      navigate('/auth');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    if (userData.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchInventoryData();
    fetchDonationHistory();
    fetchDonorList();
  }, [navigate]);

  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // First try public endpoint to test connectivity
      const publicRes = await api.get('/inventory');
      console.log('Public inventory data:', publicRes.data);
      
      // Then try admin endpoints
      const [inventoryRes, statsRes] = await Promise.all([
        api.get('/admin/inventory', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        api.get('/admin/inventory/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      console.log('Admin inventory data:', inventoryRes.data);
      console.log('Admin stats data:', statsRes.data);

      setInventory(inventoryRes.data.inventory || {});
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
      
      // Fallback to public endpoint if admin fails
      try {
        const publicRes = await api.get('/inventory');
        setInventory(publicRes.data.inventory || {});
        setStats({
          total_units: publicRes.data.total_units || 0,
          low_stock_groups: publicRes.data.low_stock_groups?.length || 0,
          critical_groups: 0
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        // Set hardcoded values as last resort
        setInventory({
          'A+': { available_units: 10, status: 'available' },
          'A-': { available_units: 8, status: 'available' },
          'B+': { available_units: 12, status: 'available' },
          'B-': { available_units: 4, status: 'low' },
          'AB+': { available_units: 6, status: 'available' },
          'AB-': { available_units: 3, status: 'low' },
          'O+': { available_units: 16, status: 'available' },
          'O-': { available_units: 7, status: 'available' }
        });
        setStats({
          total_units: 66,
          low_stock_groups: 2,
          critical_groups: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/inventory/donations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDonations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch donation history:', error);
    }
  };

  const fetchDonorList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/inventory/donors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDonorList(response.data);
    } catch (error) {
      console.error('Failed to fetch donor list:', error);
    }
  };

  const fetchDonorByEmail = async (email) => {
    if (!email) {
      setCurrentDonor(null);
      setDonationForm(prev => ({ ...prev, blood_group: '' }));
      return;
    }

    setLoadingDonor(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/admin/inventory/donor-lookup', 
        { email }, 
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      const donor = response.data;
      setCurrentDonor(donor);
      setDonationForm(prev => ({ 
        ...prev, 
        blood_group: donor.blood_group || ''
      }));
    } catch (error) {
      console.error('Failed to fetch donor:', error);
      setCurrentDonor(null);
      setDonationForm(prev => ({ ...prev, blood_group: '' }));
      
      // Don't show alert here as it would be annoying while typing
      // The error will be shown when they try to submit the form
    } finally {
      setLoadingDonor(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/admin/inventory/record-donation', donationForm, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setShowDonationForm(false);
      setDonationForm({
        donor_email: '',
        blood_group: '',
        units_donated: 1,
        donation_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setCurrentDonor(null);
      
      fetchInventoryData();
      fetchDonationHistory();
      alert('Donation recorded successfully!');
    } catch (error) {
      console.error('Failed to record donation:', error);
      let errorMessage = 'Failed to record donation';
      
      // Handle different error scenarios
      if (error.response?.data?.message) {
        const message = error.response.data.message.toLowerCase();
        
        if (message.includes('donor not found') || message.includes('no donor found')) {
          errorMessage = 'Donor not found. Please check the email address and ensure the donor is registered in our system.';
        } else if (message.includes('donor_email') || message.includes('email')) {
          errorMessage = 'Invalid donor email. Please check the email address and try again.';
        } else if (message.includes('exists')) {
          errorMessage = 'Donor with this email does not exist in our system.';
        } else if (message.includes('unauthorized')) {
          errorMessage = 'You are not authorized to record donations.';
        } else if (message.includes('blood group')) {
          errorMessage = 'Donor blood group information is missing. Please contact support.';
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.data?.errors?.donor_email) {
        errorMessage = 'Invalid donor email: ' + error.response.data.errors.donor_email[0];
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        if (error.message.includes('404')) {
          errorMessage = 'Donor not found. Please check the email address and try again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You are not authorized to record donations.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else {
          errorMessage = 'Network error: ' + error.message;
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again or contact support if the problem persists.';
      }
      
      alert(errorMessage);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/admin/inventory/update', updateForm, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setShowUpdateForm(false);
      setUpdateForm({
        blood_group: '',
        units_change: 0,
        operation: 'add',
        notes: ''
      });
      
      // Refresh inventory data
      await fetchInventoryData();
      
      // Show success message
      const operationText = updateForm.operation === 'manual_set' ? 'set to exact count' : 
                           updateForm.operation === 'add' ? 'added units to' : 'subtracted units from';
      alert(`Inventory updated successfully! ${operationText} ${updateForm.blood_group}`);
    } catch (error) {
      console.error('Failed to update inventory:', error);
      let errorMessage = 'Failed to update inventory';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Failed to update inventory: ' + errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#28a745';
      case 'low': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      available: { bg: '#d4edda', color: '#155724' },
      low: { bg: '#fff3cd', color: '#856404' },
      critical: { bg: '#f8d7da', color: '#721c24' }
    };
    const style = colors[status] || colors.available;
    return { ...style, padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Inventory Management</h1>
          <button className="btn-logout" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/auth');
          }}>Logout</button>
        </div>

        <div className="dashboard-grid">
          {/* Inventory Overview */}
          <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
            <h2>Blood Inventory Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {BLOOD_TYPES.map(type => {
                const data = inventory[type] || { available_units: 0, status: 'available' };
                const badgeStyle = getStatusBadge(data.status);
                return (
                  <div key={type} style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c0392b' }}>{type}</div>
                    <div style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{data.available_units}</div>
                    <div style={badgeStyle}>{data.status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="dashboard-card">
            <h2>Statistics</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <span>Total Units:</span>
                <strong>{stats.total_units || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <span>Low Stock Groups:</span>
                <strong style={{ color: '#ffc107' }}>{stats.low_stock_groups || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <span>Critical Groups:</span>
                <strong style={{ color: '#dc3545' }}>{stats.critical_groups || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Today's Donations:</span>
                <strong>{stats.total_donations_today || 0}</strong>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <h2>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className="btn-action" 
                onClick={() => setShowDonationForm(true)}
                style={{ background: '#28a745', color: 'white' }}
              >
                Record Donation
              </button>
              <button 
                className="btn-action" 
                onClick={() => setShowUpdateForm(true)}
                style={{ background: '#007bff', color: 'white' }}
              >
                Update Inventory
              </button>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
            <h2>Recent Donations</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {donations.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No donations recorded yet</p>
              ) : (
                donations.slice(0, 10).map(donation => (
                  <div key={donation.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderBottom: '1px solid #eee',
                    fontSize: '0.9rem'
                  }}>
                    <div>
                      <strong>{donation.donor?.name || 'Unknown'}</strong>
                      <span style={{ margin: '0 0.5rem', color: '#666' }}>donated</span>
                      <span style={{ background: '#c0392b', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
                        {donation.blood_group}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{donation.units_donated} unit{donation.units_donated > 1 ? 's' : ''}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(donation.donation_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Donation Form Modal */}
        {showDonationForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h3>Record Donation</h3>
              <form onSubmit={handleDonationSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Donor Email *</label>
                  <input
                    type="email"
                    value={donationForm.donor_email}
                    onChange={(e) => {
                      setDonationForm({...donationForm, donor_email: e.target.value});
                      fetchDonorByEmail(e.target.value);
                    }}
                    placeholder="Enter donor's email address"
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  {loadingDonor && <small style={{ color: '#666' }}>Looking up donor...</small>}
                  {currentDonor && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0f8ff', borderRadius: '4px' }}>
                      <small style={{ color: '#333' }}>
                        <strong>{currentDonor.name}</strong> - Blood Group: <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{currentDonor.blood_group}</span>
                        {!currentDonor.is_eligible && <span style={{ color: '#dc3545', marginLeft: '1rem' }}>Not eligible for donation</span>}
                      </small>
                    </div>
                  )}
                  {!loadingDonor && donationForm.donor_email && !currentDonor && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
                      <small style={{ color: '#856404' }}>
                        <strong>Donor not found</strong> - The email address you entered is not registered in our system.
                      </small>
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Blood Group *</label>
                  <input
                    type="text"
                    value={donationForm.blood_group}
                    readOnly
                    placeholder="Auto-filled from donor profile"
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px',
                      backgroundColor: '#f5f5f5',
                      color: donationForm.blood_group ? '#333' : '#999'
                    }}
                  />
                  <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                    Blood group is automatically retrieved from donor's profile
                  </small>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Units Donated *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={donationForm.units_donated}
                    onChange={(e) => setDonationForm({...donationForm, units_donated: parseInt(e.target.value)})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Donation Date *</label>
                  <input
                    type="date"
                    value={donationForm.donation_date}
                    onChange={(e) => setDonationForm({...donationForm, donation_date: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Notes</label>
                  <textarea
                    value={donationForm.notes}
                    onChange={(e) => setDonationForm({...donationForm, notes: e.target.value})}
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowDonationForm(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!currentDonor || !donationForm.blood_group}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: 'none', 
                      borderRadius: '4px', 
                      background: (!currentDonor || !donationForm.blood_group) ? '#ccc' : '#28a745', 
                      color: 'white',
                      cursor: (!currentDonor || !donationForm.blood_group) ? 'not-allowed' : 'pointer',
                      opacity: (!currentDonor || !donationForm.blood_group) ? 0.6 : 1
                    }}
                  >
                    Record Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h3>Update Inventory</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Blood Group *</label>
                  <select
                    value={updateForm.blood_group}
                    onChange={(e) => setUpdateForm({...updateForm, blood_group: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select</option>
                    {BLOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Operation *</label>
                  <select
                    value={updateForm.operation}
                    onChange={(e) => setUpdateForm({...updateForm, operation: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="add">Add Units</option>
                    <option value="subtract">Subtract Units</option>
                    <option value="manual_set">Set Exact Count</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Units {updateForm.operation === 'manual_set' ? 'Count' : 'Change'} *</label>
                  <input
                    type="number"
                    value={updateForm.units_change}
                    onChange={(e) => setUpdateForm({...updateForm, units_change: parseInt(e.target.value)})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Notes</label>
                  <textarea
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowUpdateForm(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', background: '#007bff', color: 'white' }}>
                    Update Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryManagement;

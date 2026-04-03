import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DonorCard from '../components/DonorCard';
import '../styles/DonorList.css';
import axios from 'axios';

function DonorList() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? {
          'Authorization': `Bearer ${token}`
        } : {};
        
        const response = await axios.get('http://localhost:8000/api/donors', {
          headers
        });
        
        setDonors(response.data);
        setFilteredDonors(response.data);
      } catch (error) {
        console.error('Failed to fetch donors:', error);
        // Fallback to mock data if API fails
        const mockDonors = [
          {
            id: 1,
            name: 'John Smith',
            blood_group: 'O+',
            location: 'New York, NY',
            phone: '+1 (555) 123-4567',
            total_donations: 8,
            last_donation: '2024-02-15'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            blood_group: 'A+',
            location: 'Los Angeles, CA',
            phone: '+1 (555) 987-6543',
            total_donations: 5,
            last_donation: '2024-01-20'
          },
          {
            id: 3,
            name: 'Michael Chen',
            blood_group: 'B+',
            location: 'Chicago, IL',
            phone: '+1 (555) 456-7890',
            total_donations: 12,
            last_donation: '2024-03-01'
          },
          {
            id: 4,
            name: 'Emily Davis',
            blood_group: 'AB-',
            location: 'Houston, TX',
            phone: '+1 (555) 321-9876',
            total_donations: 3,
            last_donation: '2024-02-28'
          },
          {
            id: 5,
            name: 'Robert Wilson',
            blood_group: 'O-',
            location: 'Phoenix, AZ',
            phone: '+1 (555) 654-3210',
            total_donations: 15,
            last_donation: '2024-01-10'
          },
          {
            id: 6,
            name: 'Jessica Brown',
            blood_group: 'A-',
            location: 'Philadelphia, PA',
            phone: '+1 (555) 789-0123',
            total_donations: 6,
            last_donation: '2024-03-05'
          }
        ];
        setDonors(mockDonors);
        setFilteredDonors(mockDonors);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  useEffect(() => {
    let filtered = donors;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply blood type filter
    if (bloodTypeFilter !== 'all') {
      filtered = filtered.filter(donor => donor.blood_group === bloodTypeFilter);
    }

    setFilteredDonors(filtered);
  }, [donors, searchTerm, bloodTypeFilter]);

  const handleContactDonor = (donor) => {
    // Navigate to contact page or open contact modal
    console.log('Contact donor:', donor);
    // For now, just show an alert
    alert(`Contact ${donor.name} at ${donor.phone}`);
  };

  if (loading) {
    return (
      <div className="donor-list">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-list">
      <Navbar />
      <div className="donor-list-container">
        <div className="donor-list-header">
          <h1>Blood Donors</h1>
          <p>Find and connect with blood donors in your area</p>
        </div>

        <div className="search-filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search donors by name, location, or blood type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="blood-type">Blood Type</label>
              <select
                id="blood-type"
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-section">
          <p className="results-count">
            {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} found
          </p>

          {filteredDonors.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <path d="M8 11h6"></path>
                </svg>
              </div>
              <h3>No donors found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="donors-grid">
              {filteredDonors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  onContact={() => handleContactDonor(donor)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorList;

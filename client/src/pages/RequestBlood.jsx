import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const URGENCY_BADGE = {
  critical: { label: 'Critical', style: { background: '#dc3545', color: 'white' } },
  urgent:   { label: 'Urgent',   style: { background: '#fd7e14', color: 'white' } },
  normal:   { label: 'Normal',   style: { background: '#28a745', color: 'white' } },
};

const emptyForm = {
  patient_name: '',
  contact_number: '',
  email: '',
  blood_type: '',
  units_needed: 1,
  urgency_level: 'normal',
  hospital_name: '',
  city: '',
  required_by: '',
  notes: '',
};

function RequestBlood() {
  const [formData, setFormData] = useState(emptyForm);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/blood-requests');
      setRequests(res.data);
    } catch {
      // fail silently — list is non-critical
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post('http://localhost:8000/api/blood-requests', formData);
      setSuccess(true);
      setFormData(emptyForm);
      fetchRequests(); // refresh list immediately
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Failed to submit. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--grey, #f5f5f5)' }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 1.5rem 3rem' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--red, #c0392b)', marginBottom: '0.5rem' }}>
            Request Blood
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem' }}>
            Fill out the form below. Your request will be listed publicly so donors can reach out.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <strong>Request submitted!</strong> Your request is now live below.
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.08)', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Patient Details</h2>
          <form onSubmit={handleSubmit}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Patient Name *</label>
                <input type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Contact Number *</label>
                <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Email (optional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Blood Type *</label>
                <select name="blood_type" value={formData.blood_type} onChange={handleChange} required>
                  <option value="">Select</option>
                  {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Units Needed *</label>
                <input type="number" name="units_needed" value={formData.units_needed} onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label>Urgency *</label>
                <select name="urgency_level" value={formData.urgency_level} onChange={handleChange} required>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Hospital Name *</label>
                <input type="text" name="hospital_name" value={formData.hospital_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Required By (optional)</label>
              <input type="date" name="required_by" value={formData.required_by} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Additional Notes (optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--red, #c0392b)', color: 'white',
                border: 'none', borderRadius: 8, padding: '0.9rem 2rem',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                opacity: loading ? 0.6 : 1, width: '100%', marginTop: '0.5rem'
              }}
            >
              {loading ? 'Submitting...' : 'Submit Blood Request'}
            </button>
          </form>
        </div>

        {/* Live List */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
            Active Blood Requests
            {!listLoading && <span style={{ fontSize: '1rem', fontWeight: 400, color: '#777', marginLeft: '0.75rem' }}>({requests.length} open)</span>}
          </h2>

          {listLoading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#777' }}>
              No active blood requests at the moment.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.map((req) => {
                const badge = URGENCY_BADGE[req.urgency_level];
                return (
                  <div key={req.id} style={{ background: 'white', borderRadius: 12, padding: '1.25rem 1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.07)', borderLeft: `4px solid ${badge.style.background}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--red, #c0392b)', marginRight: '0.75rem' }}>{req.blood_type}</span>
                        <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{req.patient_name}</span>
                      </div>
                      <span style={{ ...badge.style, padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ marginTop: '0.6rem', color: '#555', fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      <span>🏥 {req.hospital_name}</span>
                      <span>📍 {req.city}</span>
                      <span>🩸 {req.units_needed} unit{req.units_needed > 1 ? 's' : ''}</span>
                      {req.required_by && <span>📅 Needed by {new Date(req.required_by).toLocaleDateString()}</span>}
                    </div>
                    {req.notes && <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>{req.notes}</p>}
                    <div style={{ marginTop: '0.75rem' }}>
                      <a
                        href={`tel:${req.contact_number}`}
                        style={{ background: 'var(--red, #c0392b)', color: 'white', padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                      >
                        📞 Contact: {req.contact_number}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestBlood;
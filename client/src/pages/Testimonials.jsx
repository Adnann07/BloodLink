import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ROLE_LABELS = {
  donor: 'Blood Donor',
  recipient: 'Blood Recipient',
  volunteer: 'Volunteer',
  other: 'Other',
};

const emptyForm = {
  name: '',
  city: '',
  role: 'donor',
  blood_type: '',
  message: '',
};

function Testimonials() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [testimonials, setTestimonials] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/testimonials');
      setTestimonials(res.data);
    } catch {
      // fail silently
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post('http://localhost:8000/api/testimonials', formData);
      setSuccess(true);
      setFormData(emptyForm);
      fetchTestimonials();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Failed to submit. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 1.5rem 3rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--red, #c0392b)', marginBottom: '0.5rem' }}>
            Stories & Testimonials
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem' }}>
            Real stories from donors, recipients, and volunteers who have been part of this journey.
          </p>
        </div>

        {success && (
          <div style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <strong>Thank you for sharing your story.</strong> It is now live below.
          </div>
        )}

        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.08)', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Share Your Story</h2>
          <form onSubmit={handleSubmit}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Your Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="donor">Blood Donor</option>
                  <option value="recipient">Blood Recipient</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Type (optional)</label>
                <select name="blood_type" value={formData.blood_type} onChange={handleChange}>
                  <option value="">Select</option>
                  {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Your Story * <span style={{ fontWeight: 400, color: '#888', fontSize: '0.85rem' }}>(min 20 characters)</span></label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                minLength={20}
                maxLength={1000}
                placeholder="Tell us about your experience..."
              />
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999', marginTop: '0.25rem' }}>
                {formData.message.length} / 1000
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'var(--red, #c0392b)', color: 'white',
                border: 'none', borderRadius: 8, padding: '0.9rem 2rem',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                opacity: submitting ? 0.6 : 1, width: '100%', marginTop: '0.5rem',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </form>
        </div>

        {/* List */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
            What People Are Saying
            {!listLoading && (
              <span style={{ fontSize: '1rem', fontWeight: 400, color: '#777', marginLeft: '0.75rem' }}>
                ({testimonials.length})
              </span>
            )}
          </h2>

          {listLoading ? (
            <p>Loading testimonials...</p>
          ) : testimonials.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#777' }}>
              No testimonials yet. Be the first to share your story.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {testimonials.map((t) => (
                <div key={t.id} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.07)', borderLeft: '4px solid var(--red, #c0392b)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t.name}</span>
                      {t.city && <span style={{ color: '#777', fontSize: '0.85rem', marginLeft: '0.5rem' }}>{t.city}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {t.blood_type && (
                        <span style={{ background: 'var(--red, #c0392b)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                          {t.blood_type}
                        </span>
                      )}
                      <span style={{ background: '#f0f0f0', color: '#555', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem' }}>
                        {ROLE_LABELS[t.role]}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#444', lineHeight: 1.7, margin: 0 }}>{t.message}</p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#aaa' }}>
                    {new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: '2px solid var(--red, #c0392b)', color: 'var(--red, #c0392b)', padding: '0.6rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}
// Exports the Testimonials component to be used in the app's route configuration
export default Testimonials;

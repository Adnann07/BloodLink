import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

const CATEGORIES = [
  'Blood Donor Volunteer',
  'Awareness Campaigner',
  'Blood Donation Campaign Volunteer',
  'Healthcare Professional',
]

const AVAILABILITY_OPTIONS = [
  'Weekdays only',
  'Weekends only',
  'Weekdays and weekends',
  'Flexible / On-call',
]

const CATEGORY_DESCRIPTIONS = {
  'Blood Donor Volunteer': 'Volunteers who regularly donate blood and encourage others to do the same.',
  'Awareness Campaigner': 'Volunteers who spread awareness about blood donation through campaigns and outreach.',
  'Blood Donation Campaign Volunteer': 'Volunteers who help organize and run blood donation drives and events.',
  'Healthcare Professional': 'Doctors, nurses, and medical staff who volunteer their expertise.',
}

function Volunteers() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    category: '', availability: '', experience: '', motivation: ''
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [volunteers, setVolunteers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchVolunteers() }, [])

  async function fetchVolunteers() {
    try {
      const res = await api.get('/volunteers')
      setVolunteers(res.data.volunteers || {})
    } catch (err) {
      console.error('Failed to fetch volunteers:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    setFormError('')
    setFormSuccess('')

    if (!form.name || !form.email || !form.category) {
      setFormError('Name, email, and category are required.')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post('/volunteers', form)
      setFormSuccess(res.data.message)
      setForm({ name: '', email: '', phone: '', city: '', category: '', availability: '', experience: '', motivation: '' })
      fetchVolunteers()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalCount = Object.values(volunteers).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="volunteer-body">
      <Navbar />

      <section className="volunteer-hero">
        <div className="volunteer-hero-text">
          <h1>Become a <span>Volunteer</span></h1>
          <p>Join our dedicated team making a real difference in the lives of patients every day.</p>
          {!loading && totalCount > 0 && (
            <div className="volunteer-hero-count">{totalCount} volunteers and counting</div>
          )}
        </div>
      </section>

      <div className="volunteer-content">

        {/* Application Form */}
        <section className="volunteer-form-section">
          <div className="volunteer-form-card">
            <div className="volunteer-form-header">
              <h2>Volunteer Application</h2>
              <p>Complete the form below to join our volunteer network</p>
            </div>

            <div className="volunteer-form-row">
              <div className="form-group">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" placeholder="Your full name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <input type="email" placeholder="Your email address"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="volunteer-form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Your phone number"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="Your city"
                  value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Volunteer Category <span className="req">*</span></label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {form.category && (
                <p className="field-hint">{CATEGORY_DESCRIPTIONS[form.category]}</p>
              )}
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
                <option value="">Select your availability</option>
                {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Relevant Experience</label>
              <textarea placeholder="Describe any relevant experience you have (medical background, previous volunteering, event organizing, etc.)"
                rows={3} value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Why do you want to volunteer with BloodLink?</label>
              <textarea placeholder="Tell us what motivates you to volunteer and what you hope to contribute."
                rows={3} value={form.motivation}
                onChange={e => setForm({ ...form, motivation: e.target.value })} />
            </div>

            {formError && <p className="auth-error">{formError}</p>}
            {formSuccess && <p className="volunteer-success">{formSuccess}</p>}

            <button className="btn-auth" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </section>

        {/* Volunteers List */}
        <section className="volunteer-list-section">
          <h2 className="section-title">Current Volunteers</h2>
          <p className="section-sub">Our volunteer network across all categories</p>

          {loading ? (
            <div className="volunteer-loading">Loading volunteers...</div>
          ) : totalCount === 0 ? (
            <div className="volunteer-empty">
              <p>No volunteers yet. Be the first to apply.</p>
            </div>
          ) : (
            <div className="volunteer-categories">
              {CATEGORIES.map(category => {
                const list = volunteers[category] || []
                if (list.length === 0) return null
                return (
                  <div key={category} className="volunteer-category-section">
                    <div className="volunteer-category-header">
                      <div>
                        <h3>{category}</h3>
                        <p>{CATEGORY_DESCRIPTIONS[category]}</p>
                      </div>
                      <span className="volunteer-category-count">{list.length}</span>
                    </div>
                    <div className="volunteer-cards">
                      {list.map(v => (
                        <div key={v.id} className="volunteer-card">
                          <div className="volunteer-avatar">
                            {v.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="volunteer-info">
                            <h4>{v.name}</h4>
                            {v.city && <p className="volunteer-meta">{v.city}</p>}
                            {v.availability && <p className="volunteer-meta">Available: {v.availability}</p>}
                            {v.experience && (
                              <p className="volunteer-detail">
                                {v.experience.length > 120 ? v.experience.substring(0, 120) + '...' : v.experience}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default Volunteers
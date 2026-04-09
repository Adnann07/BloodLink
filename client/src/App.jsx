import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import EmailVerification from './pages/EmailVerification'
import AskAI from './pages/AskAI'
import DonorDashboard from './pages/DonorDashboard'
import DonorList from './pages/DonorList'
import AdminDashboard from './pages/AdminDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import Contact from './pages/Contact'
import MapPage from './pages/MapPage'
import Volunteers from './pages/Volunteers'
import RequestBlood from './pages/RequestBlood' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/askai" element={<AskAI />} />
        <Route path="/donors" element={<DonorList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<DonorDashboard />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/requestblood" element={<RequestBlood />} />

        <Route path="/map" element={<MapPage />} />
        <Route path="/volunteers" element={<Volunteers />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App

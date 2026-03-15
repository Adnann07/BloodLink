import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import AskAI from './pages/AskAI'
import DonorDashboard from './pages/DonorDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/askai" element={<AskAI />} />
        <Route path="/dashboard" element={<DonorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Donor from './pages/Donor';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/donor" element={<Donor />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/volunteers" element={<Volunteer />} />
                <Route path="/contact" element={<Contact />} />
                {/* Fallback to Home */}
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
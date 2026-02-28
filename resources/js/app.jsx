import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Volunteer from './pages/Volunteer';
import Donor from './pages/Donor';
import Contact from './pages/Contact';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/donor" element={<Donor />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
```

**Ctrl + S** to save.

---

Then run:
```
mkdir resources\js\pages
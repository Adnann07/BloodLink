// This tells ESLint: "I know this variable isn't used yet, don't yell at me."
// eslint-disable-next-line no-unused-vars
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <span className="nav-brand">BloodLink</span>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#">Donor</a></li>
          <li><a href="#">Donate</a></li>
          <li><Link to="/askai">Ask AI</Link></li>
          <li><a href="#">Volunteers</a></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="nav-right">
          <Link to="/auth" className="nav-login">Log in or create account</Link>
          <button className="btn-nav">Donate Now</button>
        </div>
      </nav>
      <div className="nav-underline"></div>
    </>
  )
}

export default Navbar

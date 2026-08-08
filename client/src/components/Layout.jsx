import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Inventory System</div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/suppliers" onClick={() => setMenuOpen(false)}>Suppliers</Link>
          {isLoggedIn ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </nav>
      <main className="page-container">{children}</main>
    </div>
  );
}

export default Layout;
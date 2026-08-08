import { Link, useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Inventory System</div>
        <div className="navbar-links">
          <Link to="/products">Products</Link>
          <Link to="/suppliers">Suppliers</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
      <main className="page-container">{children}</main>
    </div>
  );
}

export default Layout;
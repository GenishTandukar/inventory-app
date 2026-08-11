import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  const loadSuppliers = () => {
    setLoading(true);
    api.get('/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch(() => setError('Could not load suppliers. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      loadSuppliers();
    } catch {
      setError('Could not delete supplier.');
    }
  };

  return (
    <div>
      <h1>Suppliers</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoggedIn && <Link to="/suppliers/new" className="top-link">+ Add Supplier</Link>}

      {loading ? (
        <p>Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <div className="supplier-grid">
          {suppliers.map((s) => (
            <div key={s.id} className="supplier-card">
              <div className="supplier-avatar">
                {s.name.charAt(0).toUpperCase()}
              </div>

              <h3 className="supplier-name">{s.name}</h3>

              <div className="supplier-details">
                <div className="supplier-detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{s.email}</span>
                </div>
                <div className="supplier-detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 6a2 2 0 0 1 1-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  <span>{s.phone}</span>
                </div>
                {s.address && (
                  <div className="supplier-detail-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>{s.address}</span>
                  </div>
                )}
              </div>

              {isLoggedIn && (
                <div className="supplier-card-actions">
                  <Link to={`/suppliers/${s.id}/edit`}>Edit</Link>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SupplierList;
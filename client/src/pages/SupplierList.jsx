import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  const loadSuppliers = () => {
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

  if (loading) return <p>Loading suppliers...</p>;

  return (
    <div>
      <h1>Suppliers</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoggedIn && <Link to="/suppliers/new">+ Add Supplier</Link>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            {isLoggedIn && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.address}</td>
              {isLoggedIn && (
                <td>
                  <Link to={`/suppliers/${s.id}/edit`}>Edit</Link>{' '}
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierList;
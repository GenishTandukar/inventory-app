import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  const loadProducts = () => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch {
      setError('Could not delete product.');
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoggedIn && <Link to="/products/new">+ Add Product</Link>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Supplier</th>
            {isLoggedIn && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.quantity < 5 ? 'low-stock' : ''}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{p.Supplier ? p.Supplier.name : '—'}</td>
              {isLoggedIn && (
                <td>
                  <Link to={`/products/${p.id}/edit`}>Edit</Link>{' '}
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
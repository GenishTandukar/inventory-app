import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  // Load suppliers once, for the filter dropdown
  useEffect(() => {
    api.get('/suppliers').then((res) => setSuppliers(res.data));
  }, []);

  // Load products whenever search or supplierFilter changes
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (supplierFilter) params.supplierId = supplierFilter;

    api.get('/products', { params })
      .then((res) => setProducts(res.data))
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [search, supplierFilter]);

  const loadProducts = () => {
    const params = {};
    if (search) params.search = search;
    if (supplierFilter) params.supplierId = supplierFilter;
    api.get('/products', { params })
      .then((res) => setProducts(res.data))
      .catch(() => setError('Could not load products. Please try again.'));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch {
      setError('Could not delete product.');
    }
  };

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoggedIn && <Link to="/products/new" className="top-link">+ Add Product</Link>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
          <option value="">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Image</th>
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
                <td>
                  {p.imageUrl ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${p.imageUrl}`}
                      alt={p.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td><Link to={`/products/${p.id}`} className="product-name-link">{p.name}</Link></td>
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
      )}
    </div>
  );
}

export default ProductList;
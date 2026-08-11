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

  useEffect(() => {
    api.get('/suppliers').then((res) => setSuppliers(res.data));
  }, []);

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
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className={`product-card ${p.quantity < 5 ? 'low-stock-card' : ''}`}>
              <div className="product-card-image">
                {p.imageUrl ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${p.imageUrl}`}
                    alt={p.name}
                  />
                ) : (
                  <div className="product-card-noimage">No image</div>
                )}
                {p.quantity < 5 && <span className="low-stock-badge">Low Stock</span>}
              </div>

              <div className="product-card-body">
                <Link to={`/products/${p.id}`} className="product-card-name">{p.name}</Link>
                <p className="product-card-sku">{p.sku}</p>
                <p className="product-card-price">Rs. {p.price}</p>
                <p className="product-card-meta">
                  Qty: <strong>{p.quantity}</strong> &middot; {p.Supplier ? p.Supplier.name : '—'}
                </p>

                {isLoggedIn && (
                  <div className="product-card-actions">
                    <Link to={`/products/${p.id}/edit`}>Edit</Link>
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
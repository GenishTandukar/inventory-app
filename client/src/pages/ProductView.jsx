import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (notFound) {
    return (
      <p>
        This product no longer exists. It may have been removed.{' '}
        <Link to="/products">Back to Products</Link>
      </p>
    );
  }

  return (
    <div>
      <Link to="/products" className="top-link">← Back to Products</Link>

      <div className="product-detail-card">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${product.imageUrl}`}
              alt={product.name}
            />
          ) : (
            <div className="product-card-noimage">No image</div>
          )}
          {product.quantity < 5 && <span className="low-stock-badge">Low Stock</span>}
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <span className="product-card-sku">{product.sku}</span>
          <p className="product-detail-price">Rs. {product.price}</p>

          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          <div className="product-detail-stats">
            <div className="product-detail-stat">
              <span className="stat-label">Quantity</span>
              <span className="stat-value">{product.quantity}</span>
            </div>
            <div className="product-detail-stat">
              <span className="stat-label">Supplier</span>
              <span className="stat-value">{product.Supplier ? product.Supplier.name : '—'}</span>
            </div>
          </div>

          {isLoggedIn && (
            <Link to={`/products/${product.id}/edit`} className="product-detail-edit-btn">
              Edit this product
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductView;
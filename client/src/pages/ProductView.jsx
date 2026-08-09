import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (notFound) {
    return (
      <p>
        This product no longer exists.{' '}
        <Link to="/products">Back to Products</Link>
      </p>
    );
  }

  return (
    <div className="product-view">
      <Link to="/products" className="top-link">← Back to Products</Link>
      <h1>{product.name}</h1>

      {product.imageUrl && (
        <img
          src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${product.imageUrl}`}
          alt={product.name}
          className="product-view-image"
        />
      )}

      <table border="1" cellPadding="8">
        <tbody>
          <tr>
            <th>SKU</th>
            <td>{product.sku}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{product.description || '—'}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>{product.price}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td className={product.quantity < 5 ? 'low-stock' : ''}>
              {product.quantity}
              {product.quantity < 5 && ' (Low Stock)'}
            </td>
          </tr>
          <tr>
            <th>Supplier</th>
            <td>{product.Supplier ? product.Supplier.name : '—'}</td>
          </tr>
        </tbody>
      </table>

      {isLoggedIn && (
        <Link to={`/products/${product.id}/edit`} className="top-link">
          Edit this product
        </Link>
      )}
    </div>
  );
}

export default ProductView;
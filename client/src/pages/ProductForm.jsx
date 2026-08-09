import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function ProductForm() {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [notFound, setNotFound] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);

  useEffect(() => {
    api.get('/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch(() => setSuppliers([]));

    if (isEdit) {
      api.get(`/products/${id}`)
        .then((res) => {
          setName(res.data.name);
          setSku(res.data.sku);
          setDescription(res.data.description || '');
          setPrice(res.data.price);
          setQuantity(res.data.quantity);
          setSupplierId(res.data.supplierId);
          setCurrentImageUrl(res.data.imageUrl || '');
          setPageLoading(false);
        })
        .catch(() => {
          setNotFound(true);
          setPageLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Product name is required');
    if (!sku.trim()) return setError('SKU is required');
    if (Number(price) < 0) return setError('Price cannot be negative');
    if (Number(quantity) < 0) return setError('Quantity cannot be negative');
    if (!supplierId) return setError('Please select a supplier');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('sku', sku);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('supplierId', supplierId);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/products');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setError(serverErrors.map((e) => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      }
    }
  };

  if (pageLoading) return <p>Loading...</p>;
  if (notFound) {
    return (
      <p>
        This product no longer exists. It may have been removed.{' '}
        <a href="/products">Back to Products</a>
      </p>
    );
  }

  return (
    <div>
      <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>SKU</label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
        <div>
          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div>
          <label>Supplier</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
            <option value="">-- Select Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Image</label>
          {currentImageUrl && (
            <img
              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${currentImageUrl}`}
              alt="Current"
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
            />
          )}
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ProductForm;
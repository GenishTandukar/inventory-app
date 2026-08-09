import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function SupplierForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/suppliers/${id}`).then((res) => {
        setName(res.data.name);
        setEmail(res.data.email || '');
        setPhone(res.data.phone || '');
        setAddress(res.data.address || '');
      });
    }
  }, [id]);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Supplier name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    try {
      const data = { name, email, phone, address };
      if (isEdit) {
        await api.put(`/suppliers/${id}`, data);
      } else {
        await api.post('/suppliers', data);
      }
      navigate('/suppliers');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setError(serverErrors.map((e) => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default SupplierForm;

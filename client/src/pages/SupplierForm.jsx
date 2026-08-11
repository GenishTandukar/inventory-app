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

    if (!name.trim()) return setError('Supplier name is required');
    if (!email.trim()) return setError('Email is required');
    if (!isValidEmail(email)) return setError('Please enter a valid email address');
    if (!phone.trim()) return setError('Phone number is required');

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
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-avatar">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M3 21V8l9-5 9 5v13" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 21v-6h6v6" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="login-title">{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h1>

        {error && <p className="login-error">{error}</p>}

        <div className="login-field">
          <label>Name</label>
          <div className="login-input-wrap">
            <svg className="login-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Supplier name" />
          </div>
        </div>

        <div className="login-field">
          <label>Email</label>
          <div className="login-input-wrap">
            <svg className="login-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
          </div>
        </div>

        <div className="login-field">
          <label>Phone</label>
          <div className="login-input-wrap">
            <svg className="login-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 6a2 2 0 0 1 1-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
          </div>
        </div>

        <div className="login-field">
          <label>Address</label>
          <div className="login-input-wrap">
            <svg className="login-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" />
          </div>
        </div>

        <button type="submit" className="login-button">Save</button>
      </form>
    </div>
  );
}

export default SupplierForm;
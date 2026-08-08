import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import SupplierList from './pages/SupplierList';
import Login from './pages/Login';
import './App.css';
import SupplierForm from './pages/SupplierForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/new" element={<SupplierForm />} />
        <Route path="/suppliers/:id/edit" element={<SupplierForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;